# Rest Parameters (...): Argumentos Variáveis e Composição Flexível

## 🎯 Introdução e Definição

### Definição Conceitual

**Rest parameters** (parâmetros rest) no JavaScript são uma sintaxe introduzida no ES6 que permite que funções aceitem um **número indefinido de argumentos** como um **array nativo**. Representados pela sintaxe `...nomeParametro`, eles coletam todos os argumentos restantes passados para uma função em uma estrutura de dados array verdadeira.

Conceitualmente, rest parameters implementam o **padrão de variadic functions** - funções que podem aceitar um número variável de argumentos. Eles transformam interfaces rígidas em **contratos flexíveis** que se adaptam ao número de dados fornecidos, mantendo type safety e proporcionando acesso completo aos métodos de array.

### Contexto Histórico e Motivação

Antes do ES6 (2015), JavaScript oferecia apenas o objeto `arguments` para acessar argumentos variáveis, mas com **limitações significativas**. A introdução de rest parameters foi motivada por:

**1. Array-like vs True Array:** `arguments` é array-like, não um array verdadeiro
**2. Arrow Functions:** `arguments` não existe em arrow functions
**3. Developer Experience:** Sintaxe mais clara e expressiva
**4. Modern Patterns:** Suporte melhor para programação funcional
**5. Performance:** Otimizações do engine mais eficientes

**Evolução histórica:**
- **ES3 e anteriores:** Apenas objeto `arguments` disponível
- **ES5:** Necessidade de `Array.prototype.slice.call(arguments)`
- **ES6 (2015):** Introdução de rest parameters com sintaxe `...`
- **ES6+:** Integração com destructuring e spread operator

### Problema Fundamental que Resolve

Rest parameters resolvem problemas críticos de **flexibilidade de interface** e **manipulação de argumentos**:

**1. True Array Access:** Fornecem array verdadeiro com todos os métodos nativos
**2. Named Parameters:** Permitem nomear grupos de argumentos variáveis
**3. Arrow Function Support:** Funcionam em arrow functions (diferente de `arguments`)
**4. Clarity:** Tornam intenção de variadic functions explícita na assinatura
**5. Composition:** Facilitam patterns de programação funcional

### Importância no Ecossistema

Rest parameters são **fundamentais** para:

- **Utility Functions:** Criar funções utilitárias flexíveis
- **Functional Programming:** Patterns como reduce, compose, pipe
- **API Design:** Interfaces que aceitam múltiplos valores
- **Framework Development:** Base para sistemas de plugins e middlewares
- **Modern JavaScript:** Substituição moderna do objeto `arguments`

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **True Array:** Rest parameters são arrays verdadeiros, não array-like
2. **Position:** Devem ser sempre o último parâmetro da função
3. **Naming:** Nome descritivo melhora legibilidade e documentação
4. **Emptiness:** Podem ser arrays vazios se nenhum argumento for passado
5. **Immutability Consideration:** Modificações afetam apenas o array local

### Pilares Fundamentais

- **Variadic Interface:** Suporte nativo a número variável de argumentos
- **Array Methods:** Acesso completo a map, filter, reduce, etc.
- **Named Semantics:** Documentação clara do propósito dos argumentos
- **Arrow Compatibility:** Funcionam perfeitamente com arrow functions
- **Destructuring Integration:** Combinação poderosa com destructuring

### Visão Geral das Nuances

- **Positioning Rules:** Restrições de posicionamento na assinatura
- **Performance Characteristics:** Custos de array creation
- **Combining with Regular Parameters:** Padrões de uso misto
- **Empty Array Behavior:** Comportamento quando sem argumentos extras
- **Spread vs Rest:** Diferença conceitual entre operadores similares

---

## 🧠 Fundamentos Teóricos

### Sintaxe e Estrutura Básica

#### Anatomia do Rest Parameter

```javascript
// Sintaxe básica - rest parameter coleta todos os argumentos
function exemploBasico(...todosArgumentos) {
    console.log("Tipo:", typeof todosArgumentos);
    console.log("É Array?", Array.isArray(todosArgumentos));
    console.log("Argumentos recebidos:", todosArgumentos);
    console.log("Quantidade:", todosArgumentos.length);
    
    return todosArgumentos;
}

// Testes demonstrando variabilidade
console.log("=== SEM ARGUMENTOS ===");
exemploBasico();

console.log("=== UM ARGUMENTO ===");
exemploBasico("primeiro");

console.log("=== MÚLTIPLOS ARGUMENTOS ===");
exemploBasico("primeiro", "segundo", "terceiro");

console.log("=== TIPOS DIFERENTES ===");
exemploBasico(1, "string", true, { objeto: true }, [1, 2, 3]);
```

#### Combinação com Parâmetros Regulares

```javascript
// Rest parameter deve ser SEMPRE o último
function calcularMedia(descricao, ...numeros) {
    console.log(`Calculando média de: ${descricao}`);
    console.log("Números recebidos:", numeros);
    
    if (numeros.length === 0) {
        console.log("Nenhum número fornecido");
        return 0;
    }
    
    const soma = numeros.reduce((acc, num) => acc + num, 0);
    const media = soma / numeros.length;
    
    console.log(`Soma: ${soma}, Média: ${media.toFixed(2)}`);
    return media;
}

// Diferentes formas de uso
console.log("=== APENAS DESCRIÇÃO ===");
calcularMedia("Teste vazio");

console.log("=== COM NÚMEROS ===");
calcularMedia("Notas do aluno", 8.5, 7.0, 9.5, 6.5);

console.log("=== MUITOS NÚMEROS ===");
calcularMedia("Vendas mensais", 1000, 1500, 2000, 1800, 2200, 1900);
```

#### Multiple Named Parameters + Rest

```javascript
function criarRelatorio(titulo, autor, dataPublicacao, ...secoes) {
    console.log("=== RELATÓRIO ===");
    console.log(`Título: ${titulo}`);
    console.log(`Autor: ${autor}`);
    console.log(`Data: ${dataPublicacao}`);
    console.log(`Número de seções: ${secoes.length}`);
    
    if (secoes.length > 0) {
        console.log("\nSeções:");
        secoes.forEach((secao, index) => {
            console.log(`  ${index + 1}. ${secao}`);
        });
    }
    
    return {
        titulo,
        autor,
        dataPublicacao,
        secoes,
        totalSecoes: secoes.length
    };
}

// Uso com diferentes quantidades de seções
console.log("=== RELATÓRIO MÍNIMO ===");
criarRelatorio(
    "Relatório Anual",
    "João Silva",
    "2024-01-15"
);

console.log("=== RELATÓRIO COMPLETO ===");
criarRelatorio(
    "Análise de Mercado",
    "Maria Santos",
    "2024-02-20",
    "Introdução",
    "Metodologia",
    "Resultados",
    "Discussão",
    "Conclusão"
);
```

### Array Methods Integration

#### Native Array Operations

```javascript
// Rest parameters são arrays verdadeiros - todos os métodos disponíveis
function processarNumeros(...numeros) {
    console.log("Números originais:", numeros);
    
    // Map - transformação
    const dobrados = numeros.map(n => n * 2);
    console.log("Dobrados:", dobrados);
    
    // Filter - filtragem
    const pares = numeros.filter(n => n % 2 === 0);
    console.log("Apenas pares:", pares);
    
    // Reduce - agregação
    const soma = numeros.reduce((acc, n) => acc + n, 0);
    console.log("Soma total:", soma);
    
    // Some/Every - validação
    const temNegativos = numeros.some(n => n < 0);
    const todosPares = numeros.every(n => n % 2 === 0);
    console.log("Tem negativos?", temNegativos);
    console.log("Todos pares?", todosPares);
    
    // Find/FindIndex - busca
    const primeiroMaiorQue10 = numeros.find(n => n > 10);
    const indiceMaiorQue10 = numeros.findIndex(n => n > 10);
    console.log("Primeiro > 10:", primeiroMaiorQue10, "no índice", indiceMaiorQue10);
    
    // Sort - ordenação (cria cópia para não modificar original)
    const ordenados = [...numeros].sort((a, b) => a - b);
    console.log("Ordenados:", ordenados);
    
    return {
        original: numeros,
        dobrados,
        pares,
        soma,
        estatisticas: { temNegativos, todosPares },
        busca: { valor: primeiroMaiorQue10, indice: indiceMaiorQue10 },
        ordenados
    };
}

console.log("=== PROCESSAMENTO COMPLETO ===");
const resultado = processarNumeros(5, 12, 3, 8, 15, 4, 20, 7);
```

#### Functional Programming Patterns

```javascript
// Compose/Pipe usando rest parameters
const compose = (...funcoes) => {
    console.log(`Compose criado com ${funcoes.length} funções`);
    
    return (valorInicial) => {
        console.log("Executando compose com valor inicial:", valorInicial);
        
        // Aplica funções da direita para esquerda
        return funcoes.reduceRight((acc, fn, index) => {
            console.log(`  Aplicando função ${funcoes.length - index}:`, fn.name || 'anônima');
            const resultado = fn(acc);
            console.log(`    Resultado:`, resultado);
            return resultado;
        }, valorInicial);
    };
};

const pipe = (...funcoes) => {
    console.log(`Pipe criado com ${funcoes.length} funções`);
    
    return (valorInicial) => {
        console.log("Executando pipe com valor inicial:", valorInicial);
        
        // Aplica funções da esquerda para direita
        return funcoes.reduce((acc, fn, index) => {
            console.log(`  Aplicando função ${index + 1}:`, fn.name || 'anônima');
            const resultado = fn(acc);
            console.log(`    Resultado:`, resultado);
            return resultado;
        }, valorInicial);
    };
};

// Funções auxiliares para demonstração
const dobrar = x => x * 2;
const adicionar5 = x => x + 5;
const elevarAoQuadrado = x => x * x;

console.log("=== COMPOSE (direita -> esquerda) ===");
const processoCompose = compose(elevarAoQuadrado, adicionar5, dobrar);
const resultadoCompose = processoCompose(3); // (3 * 2 + 5)² = 11² = 121

console.log("=== PIPE (esquerda -> direita) ===");
const processoPipe = pipe(dobrar, adicionar5, elevarAoQuadrado);
const resultadoPipe = processoPipe(3); // (3 * 2 + 5)² = 11² = 121
```

### Arrow Functions Compatibility

#### Rest Parameters em Arrow Functions

```javascript
// Arrow functions têm ACESSO a rest parameters (mas NÃO a arguments)
const somar = (...numeros) => {
    console.log("Arrow function - somar");
    console.log("Números:", numeros);
    
    // Array methods funcionam perfeitamente
    return numeros.reduce((acc, n) => acc + n, 0);
};

// One-liner com rest parameters
const multiplicar = (...nums) => nums.reduce((acc, n) => acc * n, 1);

// Combinar com destructuring
const primeiroEResto = (primeiro, ...resto) => {
    console.log("Primeiro:", primeiro);
    console.log("Resto:", resto);
    return { primeiro, resto };
};

// Testes
console.log("=== ARROW FUNCTION COM REST ===");
console.log("Soma:", somar(1, 2, 3, 4, 5));
console.log("Multiplicação:", multiplicar(2, 3, 4));
console.log("Primeiro e resto:", primeiroEResto("A", "B", "C", "D"));
```

#### Comparison with Regular Functions

```javascript
// Demonstração das diferenças entre function e arrow

// Function regular - tem arguments E rest parameters
function funcaoRegular(primeiro, ...resto) {
    console.log("=== FUNÇÃO REGULAR ===");
    console.log("Primeiro parâmetro:", primeiro);
    console.log("Rest parameters:", resto);
    console.log("Objeto arguments:", arguments);
    console.log("arguments é Array?", Array.isArray(arguments));
    console.log("resto é Array?", Array.isArray(resto));
}

// Arrow function - tem APENAS rest parameters
const arrowFunction = (primeiro, ...resto) => {
    console.log("=== ARROW FUNCTION ===");
    console.log("Primeiro parâmetro:", primeiro);
    console.log("Rest parameters:", resto);
    // console.log(arguments); // ReferenceError: arguments is not defined
    console.log("resto é Array?", Array.isArray(resto));
};

// Testes comparativos
funcaoRegular("A", "B", "C", "D");
arrowFunction("A", "B", "C", "D");
```

---

## 🔍 Análise Conceitual Profunda

### Padrões de Implementação Avançados

#### Utility Functions Pattern

```javascript
// Função max/min flexível
const max = (...numeros) => {
    if (numeros.length === 0) return -Infinity;
    return Math.max(...numeros);
};

const min = (...numeros) => {
    if (numeros.length === 0) return Infinity;
    return Math.min(...numeros);
};

// Logger flexível
const logger = (nivel, ...mensagens) => {
    const timestamp = new Date().toISOString();
    const prefixo = `[${timestamp}] [${nivel.toUpperCase()}]`;
    
    console.log(prefixo, ...mensagens);
    
    return {
        timestamp,
        nivel,
        mensagens,
        texto: mensagens.join(' ')
    };
};

// Concatenador universal
const concat = (...arrays) => {
    console.log(`Concatenando ${arrays.length} arrays`);
    return arrays.reduce((acc, arr) => {
        if (Array.isArray(arr)) {
            return [...acc, ...arr];
        }
        return [...acc, arr];
    }, []);
};

// Testes
console.log("=== UTILITY FUNCTIONS ===");
console.log("Máximo:", max(5, 12, 3, 45, 23, 8));
console.log("Mínimo:", min(5, 12, 3, 45, 23, 8));

logger("info", "Sistema iniciado", "com sucesso");
logger("error", "Falha ao conectar", "ao banco", "código 500");

const resultado = concat([1, 2], [3, 4], [5, 6], [7, 8]);
console.log("Concatenado:", resultado);
```

#### Builder/Factory Pattern Enhancement

```javascript
class QueryBuilder {
    constructor() {
        this.query = {
            select: [],
            from: null,
            where: [],
            orderBy: []
        };
    }
    
    // Rest parameters para múltiplos campos
    select(...campos) {
        console.log(`Selecionando campos:`, campos);
        this.query.select.push(...campos);
        return this;
    }
    
    from(tabela) {
        console.log(`From: ${tabela}`);
        this.query.from = tabela;
        return this;
    }
    
    // Rest parameters para múltiplas condições
    where(...condicoes) {
        console.log(`Adicionando condições:`, condicoes);
        this.query.where.push(...condicoes);
        return this;
    }
    
    // Rest parameters para múltiplos ordenamentos
    orderBy(...campos) {
        console.log(`Ordenando por:`, campos);
        this.query.orderBy.push(...campos);
        return this;
    }
    
    build() {
        const { select, from, where, orderBy } = this.query;
        
        let sql = `SELECT ${select.join(', ')} FROM ${from}`;
        
        if (where.length > 0) {
            sql += ` WHERE ${where.join(' AND ')}`;
        }
        
        if (orderBy.length > 0) {
            sql += ` ORDER BY ${orderBy.join(', ')}`;
        }
        
        console.log("Query construída:", sql);
        return sql;
    }
}

// Uso do builder
console.log("=== QUERY BUILDER ===");
const query = new QueryBuilder()
    .select('id', 'nome', 'email', 'created_at')
    .from('usuarios')
    .where('ativo = true', 'idade >= 18', 'cidade = "São Paulo"')
    .orderBy('nome ASC', 'created_at DESC')
    .build();
```

#### Event System Pattern

```javascript
class EventEmitter {
    constructor() {
        this.eventos = new Map();
    }
    
    // Registrar listener
    on(evento, callback) {
        if (!this.eventos.has(evento)) {
            this.eventos.set(evento, []);
        }
        this.eventos.get(evento).push(callback);
        console.log(`Listener registrado para evento: ${evento}`);
        return this;
    }
    
    // Emitir evento com argumentos variáveis
    emit(evento, ...args) {
        console.log(`\nEmitindo evento: ${evento}`);
        console.log(`Argumentos:`, args);
        
        if (!this.eventos.has(evento)) {
            console.log(`Nenhum listener para: ${evento}`);
            return this;
        }
        
        const listeners = this.eventos.get(evento);
        console.log(`Executando ${listeners.length} listener(s)`);
        
        listeners.forEach((callback, index) => {
            console.log(`  Listener ${index + 1}:`);
            callback(...args); // Spread dos argumentos para callback
        });
        
        return this;
    }
    
    // Remover todos os listeners de um evento
    off(evento) {
        if (this.eventos.has(evento)) {
            this.eventos.delete(evento);
            console.log(`Listeners removidos para: ${evento}`);
        }
        return this;
    }
}

// Uso do event emitter
const emitter = new EventEmitter();

emitter.on('user:login', (userId, username, timestamp) => {
    console.log(`    [Listener 1] Usuário logado: ${username} (ID: ${userId}) às ${timestamp}`);
});

emitter.on('user:login', (userId, username) => {
    console.log(`    [Listener 2] Enviando email de boas-vindas para ${username}`);
});

emitter.on('data:update', (table, id, changes) => {
    console.log(`    [Listener 1] Tabela ${table} atualizada - ID ${id}`);
    console.log(`    Mudanças:`, changes);
});

// Emitir eventos com diferentes quantidades de argumentos
console.log("=== EVENT EMISSION ===");
emitter.emit('user:login', 123, 'João Silva', new Date().toISOString());

emitter.emit('data:update', 'usuarios', 456, {
    nome: 'Novo Nome',
    email: 'novo@email.com'
});

emitter.emit('evento:inexistente', 'arg1', 'arg2');
```

### Destructuring Integration

#### Rest in Array Destructuring

```javascript
// Combinar rest parameters com destructuring
function processarPrimeiroEOutros(...todos) {
    console.log("Todos os argumentos:", todos);
    
    // Destructuring do array rest
    const [primeiro, segundo, ...restantes] = todos;
    
    console.log("Primeiro:", primeiro);
    console.log("Segundo:", segundo);
    console.log("Restantes:", restantes);
    
    return {
        primeiro,
        segundo,
        restantes,
        total: todos.length
    };
}

// Função com parâmetros nomeados + rest + destructuring
function analisarDados(operacao, ...valores) {
    console.log(`\nOperação: ${operacao}`);
    console.log("Valores recebidos:", valores);
    
    // Destructuring com defaults e rest
    const [base = 0, multiplicador = 1, ...extras] = valores;
    
    console.log("Base:", base);
    console.log("Multiplicador:", multiplicador);
    console.log("Valores extras:", extras);
    
    let resultado;
    switch (operacao) {
        case 'multiplicar':
            resultado = base * multiplicador;
            break;
        case 'somar':
            resultado = base + multiplicador + extras.reduce((acc, n) => acc + n, 0);
            break;
        default:
            resultado = base;
    }
    
    return {
        operacao,
        base,
        multiplicador,
        extras,
        resultado
    };
}

// Testes
console.log("=== DESTRUCTURING COM REST ===");
processarPrimeiroEOutros("A", "B", "C", "D", "E");

console.log("=== ANÁLISE DE DADOS ===");
console.log(analisarDados("multiplicar", 5, 3));
console.log(analisarDados("somar", 10, 20, 5, 3, 2));
console.log(analisarDados("outro", 42));
```

#### Rest in Object Destructuring Context

```javascript
// Função que aceita objeto + valores extras
function criarPerfil({ nome, idade, ...outrasProps }, ...tags) {
    console.log("\n=== CRIANDO PERFIL ===");
    console.log("Nome:", nome);
    console.log("Idade:", idade);
    console.log("Outras propriedades:", outrasProps);
    console.log("Tags:", tags);
    
    return {
        basico: { nome, idade },
        extras: outrasProps,
        tags: tags,
        criadoEm: new Date()
    };
}

// Uso com diferentes combinações
const perfil1 = criarPerfil(
    {
        nome: "João",
        idade: 30,
        cidade: "São Paulo",
        profissao: "Desenvolvedor",
        email: "joao@email.com"
    },
    "javascript",
    "react",
    "nodejs"
);

console.log("\nPerfil criado:", perfil1);

const perfil2 = criarPerfil(
    { nome: "Maria", idade: 25 },
    "python",
    "data-science"
);

console.log("\nPerfil criado:", perfil2);
```

### Performance Considerations

#### Array Creation Cost

```javascript
// Análise de custo de criação de arrays
function medirPerformance(descricao, funcao, iteracoes = 100000) {
    console.log(`\n=== ${descricao} ===`);
    
    const inicio = performance.now();
    
    for (let i = 0; i < iteracoes; i++) {
        funcao();
    }
    
    const fim = performance.now();
    const tempoTotal = fim - inicio;
    const tempoPorIteracao = tempoTotal / iteracoes;
    
    console.log(`Tempo total: ${tempoTotal.toFixed(2)}ms`);
    console.log(`Tempo por iteração: ${tempoPorIteracao.toFixed(6)}ms`);
    
    return tempoTotal;
}

// Funções para comparação
function comRestParameters(...args) {
    return args.reduce((acc, n) => acc + n, 0);
}

function semRestParameters(a, b, c, d, e) {
    return a + b + c + d + e;
}

function comArguments() {
    return Array.from(arguments).reduce((acc, n) => acc + n, 0);
}

// Testes de performance
console.log("=== ANÁLISE DE PERFORMANCE ===");

const tempo1 = medirPerformance(
    "Rest Parameters",
    () => comRestParameters(1, 2, 3, 4, 5)
);

const tempo2 = medirPerformance(
    "Parâmetros Fixos",
    () => semRestParameters(1, 2, 3, 4, 5)
);

const tempo3 = medirPerformance(
    "Arguments Object",
    () => comArguments(1, 2, 3, 4, 5)
);

console.log("\n=== COMPARAÇÃO ===");
console.log(`Rest vs Fixos: ${((tempo1 / tempo2) * 100).toFixed(2)}%`);
console.log(`Rest vs Arguments: ${((tempo1 / tempo3) * 100).toFixed(2)}%`);
```

---

## 🎯 Aplicabilidade e Contextos

### Mathematical Operations

```javascript
// Biblioteca matemática com rest parameters
const MathUtils = {
    // Soma de qualquer quantidade de números
    sum: (...numeros) => {
        return numeros.reduce((acc, n) => acc + n, 0);
    },
    
    // Média aritmética
    average: (...numeros) => {
        if (numeros.length === 0) return 0;
        return MathUtils.sum(...numeros) / numeros.length;
    },
    
    // Produto de números
    product: (...numeros) => {
        return numeros.reduce((acc, n) => acc * n, 1);
    },
    
    // Mínimo e máximo
    min: (...numeros) => Math.min(...numeros),
    max: (...numeros) => Math.max(...numeros),
    
    // Variância
    variance: (...numeros) => {
        if (numeros.length === 0) return 0;
        const media = MathUtils.average(...numeros);
        const somaQuadrados = numeros.reduce((acc, n) => {
            return acc + Math.pow(n - media, 2);
        }, 0);
        return somaQuadrados / numeros.length;
    },
    
    // Desvio padrão
    standardDeviation: (...numeros) => {
        return Math.sqrt(MathUtils.variance(...numeros));
    },
    
    // Estatísticas completas
    stats: (...numeros) => {
        return {
            count: numeros.length,
            sum: MathUtils.sum(...numeros),
            average: MathUtils.average(...numeros),
            min: MathUtils.min(...numeros),
            max: MathUtils.max(...numeros),
            variance: MathUtils.variance(...numeros),
            stdDev: MathUtils.standardDeviation(...numeros)
        };
    }
};

// Uso da biblioteca
console.log("=== MATH UTILS ===");
const notas = [7.5, 8.0, 6.5, 9.0, 7.0, 8.5];

console.log("Notas:", notas);
console.log("Soma:", MathUtils.sum(...notas));
console.log("Média:", MathUtils.average(...notas).toFixed(2));
console.log("Mínima:", MathUtils.min(...notas));
console.log("Máxima:", MathUtils.max(...notas));
console.log("Desvio padrão:", MathUtils.standardDeviation(...notas).toFixed(2));

console.log("\nEstatísticas completas:");
console.log(MathUtils.stats(...notas));
```

### String Manipulation

```javascript
// Utilitários de string com rest parameters
const StringUtils = {
    // Concatenar com separador
    join: (separador, ...partes) => {
        console.log(`Juntando ${partes.length} partes com "${separador}"`);
        return partes.join(separador);
    },
    
    // Formatar template
    template: (template, ...valores) => {
        console.log(`Template: "${template}"`);
        console.log("Valores:", valores);
        
        return template.replace(/\{(\d+)\}/g, (match, index) => {
            return valores[index] !== undefined ? valores[index] : match;
        });
    },
    
    // Combinar palavras com capitalização
    titleCase: (...palavras) => {
        return palavras.map(palavra => {
            return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
        }).join(' ');
    },
    
    // Pluralizar baseado em contagem
    pluralize: (count, singular, ...pluralForms) => {
        if (count === 1) return `${count} ${singular}`;
        
        const plural = pluralForms[0] || `${singular}s`;
        return `${count} ${plural}`;
    },
    
    // Truncar e juntar com ellipsis
    truncate: (maxLength, ...textos) => {
        const combined = textos.join(' ');
        if (combined.length <= maxLength) return combined;
        return combined.slice(0, maxLength - 3) + '...';
    }
};

// Testes
console.log("=== STRING UTILS ===");

console.log("\nJoin:");
console.log(StringUtils.join(' - ', 'Node.js', 'React', 'MongoDB', 'Express'));

console.log("\nTemplate:");
const mensagem = StringUtils.template(
    "Olá {0}, você tem {1} mensagens não lidas em {2}",
    "João",
    5,
    "inbox"
);
console.log(mensagem);

console.log("\nTitle Case:");
console.log(StringUtils.titleCase('JAVASCRIPT', 'é', 'INCRÍVEL'));

console.log("\nPluralize:");
console.log(StringUtils.pluralize(1, 'item'));
console.log(StringUtils.pluralize(5, 'item'));
console.log(StringUtils.pluralize(3, 'pessoa', 'pessoas'));

console.log("\nTruncate:");
console.log(StringUtils.truncate(30, 'Este', 'é', 'um', 'texto', 'muito', 'longo', 'para', 'demonstração'));
```

### Function Composition Patterns

```javascript
// Sistema de middleware/pipeline
class Pipeline {
    constructor(...middlewares) {
        console.log(`Pipeline criado com ${middlewares.length} middleware(s)`);
        this.middlewares = middlewares;
    }
    
    // Adicionar mais middlewares
    use(...novasMiddlewares) {
        console.log(`Adicionando ${novasMiddlewares.length} middleware(s)`);
        this.middlewares.push(...novasMiddlewares);
        return this;
    }
    
    // Executar pipeline
    execute(initialValue) {
        console.log("\n=== EXECUTANDO PIPELINE ===");
        console.log("Valor inicial:", initialValue);
        
        return this.middlewares.reduce((acc, middleware, index) => {
            console.log(`\nMiddleware ${index + 1}:`);
            const result = middleware(acc);
            console.log("  Resultado:", result);
            return result;
        }, initialValue);
    }
}

// Middlewares de exemplo
const validarNumero = (valor) => {
    if (typeof valor !== 'number') {
        throw new Error('Valor deve ser número');
    }
    console.log("  ✓ Validação passou");
    return valor;
};

const multiplicarPor2 = (valor) => {
    console.log(`  Multiplicando ${valor} por 2`);
    return valor * 2;
};

const adicionar10 = (valor) => {
    console.log(`  Adicionando 10 a ${valor}`);
    return valor + 10;
};

const formatarResultado = (valor) => {
    console.log(`  Formatando resultado`);
    return `Resultado final: ${valor}`;
};

// Criar e usar pipeline
const pipeline = new Pipeline(
    validarNumero,
    multiplicarPor2,
    adicionar10,
    formatarResultado
);

const resultado = pipeline.execute(5);
console.log("\n" + resultado);

// Adicionar mais middlewares dinamicamente
console.log("\n=== PIPELINE ESTENDIDO ===");
pipeline.use(
    (valor) => {
        console.log("  Convertendo para maiúsculas");
        return valor.toUpperCase();
    }
);

const resultado2 = pipeline.execute(8);
console.log("\n" + resultado2);
```

---

## ⚠️ Limitações e Considerações Teóricas

### Positioning Restrictions

```javascript
// ❌ ERRO: Rest parameter deve ser o ÚLTIMO
// function errado(...resto, ultimo) { } // SyntaxError

// ✅ CORRETO: Rest parameter no final
function correto(primeiro, segundo, ...resto) {
    console.log("Primeiro:", primeiro);
    console.log("Segundo:", segundo);
    console.log("Resto:", resto);
}

// ❌ ERRO: Apenas UM rest parameter permitido
// function errado(...resto1, ...resto2) { } // SyntaxError

// ✅ CORRETO: Apenas um rest parameter
function correto2(...todos) {
    // Se precisar separar, use destructuring
    const [primeiro, ...resto] = todos;
    console.log("Primeiro:", primeiro);
    console.log("Resto:", resto);
}

// Demonstração
console.log("=== POSICIONAMENTO CORRETO ===");
correto("A", "B", "C", "D", "E");
correto2("A", "B", "C", "D", "E");
```

### Empty Array Behavior

```javascript
// Rest parameter como array vazio quando sem argumentos extras
function demonstrarVazio(obrigatorio, ...opcionais) {
    console.log("\nObrigatório:", obrigatorio);
    console.log("Opcionais:", opcionais);
    console.log("Opcionais é array vazio?", opcionais.length === 0);
    console.log("Tipo:", Array.isArray(opcionais));
    
    // Sempre seguro iterar - nunca undefined
    opcionais.forEach((item, index) => {
        console.log(`  ${index}: ${item}`);
    });
    
    return opcionais;
}

console.log("=== COMPORTAMENTO COM VAZIO ===");

console.log("Com opcionais:");
demonstrarVazio("valor1", "opt1", "opt2", "opt3");

console.log("\nSem opcionais:");
const vazio = demonstrarVazio("valor1");
console.log("Retornou array?", Array.isArray(vazio));
console.log("Length:", vazio.length);
```

### Mutation Considerations

```javascript
// Rest parameters criam NOVO array - modificações são locais
let originais = [1, 2, 3, 4, 5];

function modificarRest(...numeros) {
    console.log("Array recebido:", numeros);
    console.log("É o mesmo que originais?", numeros === originais);
    
    // Modificar o array rest
    numeros.push(999);
    numeros[0] = 888;
    
    console.log("Array após modificações:", numeros);
    return numeros;
}

console.log("=== MUTAÇÃO DO REST ===");
console.log("Originais antes:", originais);

const modificados = modificarRest(...originais);

console.log("Retornado:", modificados);
console.log("Originais depois:", originais);
console.log("Originais mudaram?", !originais.includes(888));
```

### Performance with Large Arguments

```javascript
// Considerar performance com muitos argumentos
function processoLeve(...args) {
    // Apenas retornar - custo mínimo
    return args;
}

function processoPesado(...args) {
    // Múltiplas operações - custo maior
    return args
        .filter(x => x > 0)
        .map(x => x * 2)
        .reduce((acc, x) => acc + x, 0);
}

// Gerar muitos argumentos
const muitosArgumentos = Array.from({ length: 10000 }, (_, i) => i);

console.log("=== PERFORMANCE COM MUITOS ARGUMENTOS ===");

console.time("Processo Leve");
processoLeve(...muitosArgumentos);
console.timeEnd("Processo Leve");

console.time("Processo Pesado");
processoPesado(...muitosArgumentos);
console.timeEnd("Processo Pesado");

// Alternativa: passar array diretamente
console.time("Array Direto");
processoPesado(muitosArgumentos); // Recebe array de arrays
console.timeEnd("Array Direto");
```

---

## 🔗 Interconexões Conceituais

### Rest vs Spread Operator

```javascript
// REST: coleta argumentos em array
function usaRest(...numeros) {
    console.log("Rest coletou:", numeros);
    return numeros;
}

// SPREAD: expande array em argumentos individuais
const arrayExistente = [1, 2, 3, 4, 5];

console.log("=== REST vs SPREAD ===");
console.log("\nRest (coleta):");
usaRest(1, 2, 3, 4, 5);

console.log("\nSpread (expande):");
usaRest(...arrayExistente); // Spread do array para argumentos

// Combinação poderosa
function combinarRestSpread(primeiro, ...resto) {
    console.log("\nPrimeiro:", primeiro);
    console.log("Resto:", resto);
    
    // Usar spread para passar resto para outra função
    const soma = MathUtils.sum(...resto);
    console.log("Soma do resto:", soma);
    
    return { primeiro, resto, soma };
}

console.log("\nCombinação Rest + Spread:");
combinarRestSpread(10, 20, 30, 40, 50);
```

### Integration with Default Parameters

```javascript
// Combinar rest parameters com defaults
function criarConfiguracao(
    nome = "App Padrão",
    versao = "1.0.0",
    ...features
) {
    console.log("\n=== CONFIGURAÇÃO ===");
    console.log("Nome:", nome);
    console.log("Versão:", versao);
    console.log("Features:", features);
    
    return {
        nome,
        versao,
        features,
        totalFeatures: features.length,
        temFeatures: features.length > 0
    };
}

// Diferentes formas de chamar
console.log("Sem argumentos:");
console.log(criarConfiguracao());

console.log("\nCom nome:");
console.log(criarConfiguracao("Minha App"));

console.log("\nCom nome, versão e features:");
console.log(criarConfiguracao(
    "Super App",
    "2.5.0",
    "autenticacao",
    "notificacoes",
    "analytics",
    "cache"
));

console.log("\nUsando undefined para pular parâmetros:");
console.log(criarConfiguracao(
    undefined,  // usa default "App Padrão"
    "3.0.0",
    "feature1",
    "feature2"
));
```

### Preparation for Arguments Object

```javascript
// Comparação direta: Rest vs Arguments
function compararRestArguments(...rest) {
    console.log("\n=== COMPARAÇÃO ===");
    
    // Rest parameters
    console.log("Rest parameters:", rest);
    console.log("  É Array?", Array.isArray(rest));
    console.log("  Tem .map?", typeof rest.map === 'function');
    console.log("  Length:", rest.length);
    
    // Arguments object
    console.log("\nArguments object:", arguments);
    console.log("  É Array?", Array.isArray(arguments));
    console.log("  Tem .map?", typeof arguments.map === 'function');
    console.log("  Length:", arguments.length);
    
    // Converter arguments para array
    const argsArray = Array.from(arguments);
    console.log("\nArguments convertido:", argsArray);
    console.log("  É Array?", Array.isArray(argsArray));
    
    return { rest, arguments: argsArray };
}

compararRestArguments(1, 2, 3, 4, 5);
```

---

## 🚀 Evolução e Próximos Conceitos

### Modern JavaScript Integration

```javascript
// Rest parameters com async/await
async function buscarMultiplosRecursos(...urls) {
    console.log(`Buscando ${urls.length} recursos...`);
    
    // Promise.all com spread
    const promises = urls.map(url => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ url, dados: `Dados de ${url}`, timestamp: Date.now() });
            }, Math.random() * 1000);
        });
    });
    
    const resultados = await Promise.all(promises);
    
    console.log("Todos os recursos carregados:");
    resultados.forEach((resultado, index) => {
        console.log(`  ${index + 1}. ${resultado.url}`);
    });
    
    return resultados;
}

// Uso com async/await
async function exemploAsync() {
    console.log("=== ASYNC COM REST PARAMETERS ===");
    
    const dados = await buscarMultiplosRecursos(
        '/api/users',
        '/api/posts',
        '/api/comments',
        '/api/likes'
    );
    
    console.log("\nDados recebidos:", dados.length, "recursos");
}

exemploAsync();
```

### Class Methods with Rest

```javascript
// Rest parameters em métodos de classe
class DataProcessor {
    constructor(nome) {
        this.nome = nome;
        this.historico = [];
    }
    
    // Método com rest parameters
    processar(...items) {
        console.log(`\n${this.nome} processando ${items.length} item(s)`);
        
        const resultado = items.map((item, index) => {
            console.log(`  Processando item ${index + 1}:`, item);
            return {
                original: item,
                processado: item.toString().toUpperCase(),
                timestamp: Date.now()
            };
        });
        
        // Adicionar ao histórico usando spread
        this.historico.push(...resultado);
        
        return resultado;
    }
    
    // Método estático com rest
    static combinar(...processadores) {
        console.log(`Combinando ${processadores.length} processadores`);
        
        return new DataProcessor('Processador Combinado');
    }
    
    // Getter para estatísticas
    get stats() {
        return {
            nome: this.nome,
            totalProcessado: this.historico.length,
            ultimosProcessados: this.historico.slice(-5)
        };
    }
}

// Uso da classe
console.log("=== CLASS COM REST PARAMETERS ===");
const processor = new DataProcessor("Processador Principal");

processor.processar('item1', 'item2', 'item3');
processor.processar('item4', 'item5');

console.log("\nEstatísticas:");
console.log(processor.stats);

const combinado = DataProcessor.combinar(processor, new DataProcessor("Outro"));
console.log("Processador combinado:", combinado.nome);
```

### Preparação para Conceitos Avançados

Rest parameters são **fundacionais** para:

- **Arguments Object:** Compreender a alternativa legacy
- **Spread Operator:** Sintaxe complementar para expansão
- **Destructuring:** Combinação poderosa com desestruturação
- **Higher-Order Functions:** Base para compose, curry, pipe
- **Async Patterns:** Processamento paralelo de múltiplos valores

---

## 📚 Conclusão

Rest parameters representam uma **evolução fundamental** na forma como JavaScript lida com argumentos variáveis. Eles transformam o padrão arcaico do objeto `arguments` em uma **sintaxe moderna, clara e poderosa** que se integra perfeitamente com o ecossistema JavaScript moderno.

**Conceitos Essenciais:**

- **True Arrays:** Rest parameters são arrays verdadeiros com todos os métodos nativos
- **Last Position:** Devem ser sempre o último parâmetro da função
- **Arrow Compatible:** Funcionam perfeitamente em arrow functions
- **Named Semantics:** Fornecem documentação clara da intenção
- **Flexible Interfaces:** Permitem APIs que se adaptam ao número de argumentos

**Aplicações Práticas:**

- **Utility Libraries:** Funções matemáticas, string manipulation, data processing
- **Function Composition:** Compose, pipe, middleware systems
- **Event Systems:** Event emitters com argumentos flexíveis
- **API Design:** Interfaces mais intuitivas e user-friendly
- **Builder Patterns:** Métodos que aceitam múltiplos valores

**Importância Estratégica:**

Rest parameters são **essenciais** para:
- Programação funcional moderna em JavaScript
- Design de bibliotecas e frameworks flexíveis
- Criação de DSLs (Domain Specific Languages)
- Padrões de composição e pipeline
- Interfaces resilientes e adaptáveis

O domínio de rest parameters é **crucial** para progressão em JavaScript moderno, sendo pré-requisito para compreender spread operator, destructuring avançado, e patterns sofisticados de programação funcional. Eles representam a evolução do JavaScript em direção a uma linguagem mais expressiva e poderosa.

