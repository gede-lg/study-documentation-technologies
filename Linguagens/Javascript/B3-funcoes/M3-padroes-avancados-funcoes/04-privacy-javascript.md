# Privacy em JavaScript: Técnicas de Encapsulamento

## 🎯 Introdução e Definição

### Definição Conceitual

**Privacy** (privacidade) em JavaScript refere-se à capacidade de **ocultar detalhes de implementação** e **proteger dados internos** de acesso e modificação externa não autorizada. É um dos pilares fundamentais da **encapsulação** em programação orientada a objetos.

JavaScript tradicionalmente não tinha suporte nativo para membros privados (como `private` em Java/C#), mas oferece **múltiplas técnicas** para alcançar privacidade usando **closures**, **símbolos**, **WeakMaps** e, desde ES2022, **private fields** (`#`).

### Evolução Histórica

- **ES3-ES5:** Closures eram a única forma de criar privacidade real
- **ES6 (2015):** Symbols ofereceram "privacidade leve"
- **ES6 (2015):** WeakMaps permitiram dados privados em objetos
- **ES2020:** Optional chaining ajudou acesso seguro
- **ES2022:** Private fields (`#`) trouxeram privacidade nativa
- **Atualidade:** Múltiplas opções com diferentes trade-offs

### Importância

Privacy é essencial para:
- **Encapsulamento:** Separar interface pública de implementação
- **Segurança:** Proteger dados sensíveis
- **Manutenibilidade:** Permitir mudanças internas sem quebrar código externo
- **Controle:** Validação e controle de acesso a dados
- **API Design:** Criar APIs limpas e intuitivas

---

## 📋 Sumário Conceitual

### Técnicas Principais

1. **Closures:** Privacidade via escopo léxico
2. **Symbols:** Chaves únicas e semi-privadas
3. **WeakMaps:** Armazenamento privado externo
4. **Private Fields (#):** Privacidade nativa (ES2022)
5. **Naming Conventions:** Convenção `_` para indicar privado

### Comparação Rápida

| Técnica | Privacidade | Performance | Complexidade | Suporte |
|---------|-------------|-------------|--------------|---------|
| Closures | ✅✅✅ Total | ⚠️ Memória | 🟡 Média | ✅ Universal |
| Symbols | 🟡 Leve | ✅ Boa | 🟢 Baixa | ✅ ES6+ |
| WeakMaps | ✅✅ Forte | ✅ Boa | 🔴 Alta | ✅ ES6+ |
| Private # | ✅✅✅ Total | ✅ Ótima | 🟢 Baixa | ⚠️ ES2022+ |
| Convention _ | ❌ Nenhuma | ✅ Ótima | 🟢 Baixa | ✅ Universal |

---

## 🧠 Fundamentos Teóricos

### 1. Closures para Privacy

```javascript
console.log("=== CLOSURES PARA PRIVACY ===\n");

function criarContaBancaria(titular, saldoInicial) {
    // Variáveis PRIVADAS (não acessíveis externamente)
    let saldo = saldoInicial;
    let historico = [];
    
    // Funções PRIVADAS
    function registrar(tipo, valor) {
        historico.push({
            tipo,
            valor,
            data: new Date(),
            saldoApos: saldo
        });
    }
    
    // API PÚBLICA (retornada)
    return {
        depositar(valor) {
            if (valor <= 0) throw new Error("Valor inválido");
            saldo += valor;
            registrar('depósito', valor);
            return saldo;
        },
        
        sacar(valor) {
            if (valor <= 0) throw new Error("Valor inválido");
            if (valor > saldo) throw new Error("Saldo insuficiente");
            saldo -= valor;
            registrar('saque', valor);
            return saldo;
        },
        
        consultarSaldo() {
            return saldo;
        },
        
        obterHistorico() {
            return historico.map(h => ({...h})); // Cópia
        }
    };
}

const conta = criarContaBancaria("João", 1000);

console.log("Saldo inicial:", conta.consultarSaldo());
conta.depositar(500);
console.log("Após depósito:", conta.consultarSaldo());
conta.sacar(200);
console.log("Após saque:", conta.consultarSaldo());

console.log("\nTentando acessar variáveis privadas:");
console.log("conta.saldo:", conta.saldo); // undefined
console.log("conta.historico:", conta.historico); // undefined
console.log("✅ Variáveis são verdadeiramente privadas!");
```

### 2. Symbols para Semi-Privacy

```javascript
console.log("\n=== SYMBOLS PARA SEMI-PRIVACY ===\n");

const _saldo = Symbol('saldo');
const _validar = Symbol('validar');

class ContaComSymbols {
    constructor(saldoInicial) {
        this[_saldo] = saldoInicial;
    }
    
    [_validar](valor) {
        if (valor <= 0) throw new Error("Valor inválido");
    }
    
    depositar(valor) {
        this[_validar](valor);
        this[_saldo] += valor;
    }
    
    consultarSaldo() {
        return this[_saldo];
    }
}

const conta2 = new ContaComSymbols(1000);
conta2.depositar(500);

console.log("Saldo:", conta2.consultarSaldo());
console.log("conta2.saldo:", conta2.saldo); // undefined
console.log("conta2._saldo:", conta2._saldo); // undefined

console.log("\n⚠️ Mas symbols podem ser descobertos:");
const symbols = Object.getOwnPropertySymbols(conta2);
console.log("Símbolos encontrados:", symbols.length);
console.log("Acessando via symbol:", conta2[symbols[0]]);
console.log("⚠️ Privacidade LEVE, não total!");
```

### 3. WeakMaps para Privacy

```javascript
console.log("\n=== WEAKMAPS PARA PRIVACY ===\n");

const dadosPrivados = new WeakMap();

class ContaComWeakMap {
    constructor(titular, saldoInicial) {
        dadosPrivados.set(this, {
            titular,
            saldo: saldoInicial,
            historico: []
        });
    }
    
    depositar(valor) {
        const dados = dadosPrivados.get(this);
        if (valor <= 0) throw new Error("Valor inválido");
        
        dados.saldo += valor;
        dados.historico.push({ tipo: 'depósito', valor });
    }
    
    sacar(valor) {
        const dados = dadosPrivados.get(this);
        if (valor <= 0) throw new Error("Valor inválido");
        if (valor > dados.saldo) throw new Error("Saldo insuficiente");
        
        dados.saldo -= valor;
        dados.historico.push({ tipo: 'saque', valor });
    }
    
    consultarSaldo() {
        return dadosPrivados.get(this).saldo;
    }
    
    obterHistorico() {
        return [...dadosPrivados.get(this).historico];
    }
}

const conta3 = new ContaComWeakMap("Maria", 1000);
conta3.depositar(500);
conta3.sacar(200);

console.log("Saldo:", conta3.consultarSaldo());
console.log("Histórico:", conta3.obterHistorico());

console.log("\nTentando acessar dados privados:");
console.log("conta3.titular:", conta3.titular); // undefined
console.log("conta3.saldo:", conta3.saldo); // undefined
console.log("Object.keys(conta3):", Object.keys(conta3));
console.log("✅ Dados verdadeiramente privados!");
```

### 4. Private Fields (#) - ES2022

```javascript
console.log("\n=== PRIVATE FIELDS (#) - ES2022 ===\n");

class ContaModerna {
    // Campos PRIVADOS (com #)
    #saldo;
    #titular;
    #historico = [];
    
    constructor(titular, saldoInicial) {
        this.#titular = titular;
        this.#saldo = saldoInicial;
    }
    
    // Método PRIVADO
    #registrar(tipo, valor) {
        this.#historico.push({
            tipo,
            valor,
            data: new Date(),
            saldoApos: this.#saldo
        });
    }
    
    // Métodos PÚBLICOS
    depositar(valor) {
        if (valor <= 0) throw new Error("Valor inválido");
        this.#saldo += valor;
        this.#registrar('depósito', valor);
    }
    
    sacar(valor) {
        if (valor <= 0) throw new Error("Valor inválido");
        if (valor > this.#saldo) throw new Error("Saldo insuficiente");
        this.#saldo -= valor;
        this.#registrar('saque', valor);
    }
    
    consultarSaldo() {
        return this.#saldo;
    }
    
    obterTitular() {
        return this.#titular;
    }
}

const conta4 = new ContaModerna("Pedro", 1000);
conta4.depositar(500);
conta4.sacar(200);

console.log("Titular:", conta4.obterTitular());
console.log("Saldo:", conta4.consultarSaldo());

console.log("\nTentando acessar campos privados:");
try {
    console.log(conta4.#saldo); // SyntaxError
} catch (e) {
    console.log("✅ SyntaxError: Private field '#saldo' inacessível!");
}

console.log("conta4.saldo:", conta4.saldo); // undefined
console.log("✅ Privacidade NATIVA e TOTAL!");
```

### 5. Naming Convention (_underscore)

```javascript
console.log("\n=== NAMING CONVENTION (_) ===\n");

class ContaComConvencao {
    constructor(saldoInicial) {
        this._saldo = saldoInicial; // "privado" por convenção
        this._historico = [];
    }
    
    _validar(valor) { // "privado" por convenção
        if (valor <= 0) throw new Error("Valor inválido");
    }
    
    depositar(valor) {
        this._validar(valor);
        this._saldo += valor;
    }
    
    consultarSaldo() {
        return this._saldo;
    }
}

const conta5 = new ContaComConvencao(1000);
conta5.depositar(500);

console.log("Saldo (método):", conta5.consultarSaldo());
console.log("conta5._saldo (direto):", conta5._saldo); // Acessível!

console.log("\n⚠️ Convenção _ NÃO garante privacidade!");
console.log("É apenas uma indicação visual para desenvolvedores");
console.log("Qualquer código pode acessar e modificar");

conta5._saldo = 999999; // Modificação direta possível
console.log("Após modificação direta:", conta5._saldo);
console.log("❌ Sem privacidade real!");
```

---

## 🔍 Análise Conceitual Profunda

### Comparação Detalhada

```javascript
console.log("\n=== COMPARAÇÃO DETALHADA ===\n");

console.log("1. CLOSURES:");
console.log("  ✅ Privacidade total");
console.log("  ✅ Suporte universal (ES3+)");
console.log("  ❌ Usa mais memória (cada instância = novas funções)");
console.log("  ❌ Não usa prototypes (sem compartilhamento)");
console.log("  ✅ Ideal para: factories, módulos, poucos objetos");

console.log("\n2. SYMBOLS:");
console.log("  🟡 Privacidade leve (descobrível)");
console.log("  ✅ Performance boa");
console.log("  ✅ Usa prototypes normalmente");
console.log("  ❌ Não totalmente privado");
console.log("  ✅ Ideal para: metadados, propriedades especiais");

console.log("\n3. WEAKMAPS:");
console.log("  ✅ Privacidade forte");
console.log("  ✅ Performance boa");
console.log("  ✅ Garbage collection automático");
console.log("  ❌ Sintaxe verbosa");
console.log("  ❌ Complexidade maior");
console.log("  ✅ Ideal para: bibliotecas, dados sensíveis");

console.log("\n4. PRIVATE FIELDS (#):");
console.log("  ✅ Privacidade total e nativa");
console.log("  ✅ Performance excelente");
console.log("  ✅ Sintaxe clara e simples");
console.log("  ✅ Usa prototypes normalmente");
console.log("  ⚠️ Suporte apenas navegadores modernos");
console.log("  ✅ Ideal para: código novo, classes ES6");

console.log("\n5. CONVENTION (_):");
console.log("  ❌ Sem privacidade real");
console.log("  ✅ Performance perfeita");
console.log("  ✅ Simplicidade máxima");
console.log("  ✅ Suporte universal");
console.log("  ✅ Ideal para: código interno, equipes disciplinadas");
```

### Quando Usar Cada Técnica

```javascript
console.log("\n=== QUANDO USAR CADA TÉCNICA ===\n");

console.log("Use CLOSURES quando:");
console.log("  • Precisa privacidade total");
console.log("  • Poucos objetos (não milhares)");
console.log("  • Suporte a navegadores antigos");
console.log("  • Está criando módulos/singletons");

console.log("\nUse SYMBOLS quando:");
console.log("  • Precisa propriedades únicas");
console.log("  • Privacidade leve é suficiente");
console.log("  • Quer evitar colisões de nomes");
console.log("  • Está criando metadados");

console.log("\nUse WEAKMAPS quando:");
console.log("  • Está criando biblioteca pública");
console.log("  • Precisa privacidade forte");
console.log("  • Quer garbage collection automático");
console.log("  • Dados sensíveis precisam proteção");

console.log("\nUse PRIVATE FIELDS (#) quando:");
console.log("  • Está escrevendo código novo");
console.log("  • Navegadores modernos são garantidos");
console.log("  • Quer sintaxe limpa e clara");
console.log("  • Está usando classes ES6");

console.log("\nUse CONVENTION (_) quando:");
console.log("  • Código é interno (não biblioteca)");
console.log("  • Equipe segue convenções");
console.log("  • Performance é crítica");
console.log("  • Simplicidade é prioridade");
```

---

## 🎯 Padrões Avançados

### Getters/Setters com Validação

```javascript
console.log("\n=== GETTERS/SETTERS COM VALIDAÇÃO ===\n");

class Usuario {
    #nome;
    #email;
    #idade;
    
    constructor(nome, email, idade) {
        this.nome = nome;   // Usa setter
        this.email = email; // Usa setter
        this.idade = idade; // Usa setter
    }
    
    get nome() {
        return this.#nome;
    }
    
    set nome(valor) {
        if (!valor || valor.length < 3) {
            throw new Error("Nome deve ter pelo menos 3 caracteres");
        }
        this.#nome = valor;
    }
    
    get email() {
        return this.#email;
    }
    
    set email(valor) {
        if (!valor.includes('@')) {
            throw new Error("Email inválido");
        }
        this.#email = valor;
    }
    
    get idade() {
        return this.#idade;
    }
    
    set idade(valor) {
        if (valor < 0 || valor > 150) {
            throw new Error("Idade inválida");
        }
        this.#idade = valor;
    }
}

const user = new Usuario("João Silva", "joao@email.com", 30);

console.log("Nome:", user.nome);
console.log("Email:", user.email);
console.log("Idade:", user.idade);

try {
    user.email = "invalido"; // Dispara validação
} catch (e) {
    console.log("\n❌ Erro ao definir email:", e.message);
}

user.email = "novo@email.com"; // Válido
console.log("Email atualizado:", user.email);
console.log("✅ Validação automática via setters!");
```

### Combinando Técnicas

```javascript
console.log("\n=== COMBINANDO TÉCNICAS ===\n");

const _config = new WeakMap();

class Aplicacao {
    #versao = '1.0.0';
    
    constructor(nome, opcoes = {}) {
        // WeakMap para configurações complexas
        _config.set(this, {
            nome,
            debug: opcoes.debug || false,
            apiKey: opcoes.apiKey || '',
            endpoints: opcoes.endpoints || {}
        });
    }
    
    get versao() {
        return this.#versao;
    }
    
    get nome() {
        return _config.get(this).nome;
    }
    
    isDebug() {
        return _config.get(this).debug;
    }
    
    #log(mensagem) {
        if (_config.get(this).debug) {
            console.log(`[${this.nome}]`, mensagem);
        }
    }
    
    executar() {
        this.#log("Aplicação executando...");
        return `${this.nome} v${this.#versao}`;
    }
}

const app = new Aplicacao("MeuApp", { debug: true });
console.log(app.executar());
console.log("Debug ativo:", app.isDebug());
console.log("✅ Combinação de WeakMap + Private Fields!");
```

---

## ⚠️ Armadilhas Comuns

```javascript
console.log("\n=== ARMADILHAS COMUNS ===\n");

console.log("❌ ERRO 1: Retornar referências a objetos privados");
class Ruim {
    #dados = { senha: "123" };
    
    getDados() {
        return this.#dados; // ❌ Retorna referência
    }
}

const r = new Ruim();
const dados = r.getDados();
dados.senha = "hackeado"; // Modifica dados privados!
console.log("Senha modificada:", r.getDados().senha);

console.log("\n✅ SOLUÇÃO: Retornar cópia");
class Bom {
    #dados = { senha: "123" };
    
    getDados() {
        return {...this.#dados}; // ✅ Retorna cópia
    }
}

console.log("\n❌ ERRO 2: Esquecer 'this' em private fields");
class Erro2 {
    #valor = 10;
    
    metodo() {
        setTimeout(function() {
            // console.log(this.#valor); // ❌ 'this' não aponta para instância
        }, 100);
    }
}

console.log("\n✅ SOLUÇÃO: Arrow function ou bind");
class Correto2 {
    #valor = 10;
    
    metodo() {
        setTimeout(() => {
            console.log("Valor:", this.#valor); // ✅ Arrow function
        }, 100);
    }
}

new Correto2().metodo();
```

---

## 🔗 Relações e Conexões

**Conceitos Relacionados:**
- Closures (fundamento de privacy)
- Module Pattern (usa closures)
- Encapsulation (princípio OOP)
- Information Hiding (teoria)
- ES6 Classes (sintaxe moderna)

**Próximos Passos:**
- Design Patterns (Factory, Builder, etc.)
- Proxy e Reflect API
- Programação Funcional
- TypeScript (private com tipos)

---

## 🚀 Exemplo Prático Completo

```javascript
console.log("\n=== SISTEMA BANCÁRIO COMPLETO ===\n");

class ContaBancaria {
    #saldo;
    #titular;
    #senha;
    #transacoes = [];
    #bloqueada = false;
    
    static #tentativasLogin = new WeakMap();
    static MAX_TENTATIVAS = 3;
    
    constructor(titular, senhaInicial, saldoInicial = 0) {
        this.#titular = titular;
        this.#senha = senhaInicial;
        this.#saldo = saldoInicial;
        ContaBancaria.#tentativasLogin.set(this, 0);
    }
    
    #validarSenha(senha) {
        if (this.#bloqueada) {
            throw new Error("Conta bloqueada");
        }
        
        if (senha !== this.#senha) {
            const tentativas = ContaBancaria.#tentativasLogin.get(this) + 1;
            ContaBancaria.#tentativasLogin.set(this, tentativas);
            
            if (tentativas >= ContaBancaria.MAX_TENTATIVAS) {
                this.#bloqueada = true;
                throw new Error("Conta bloqueada por excesso de tentativas");
            }
            
            throw new Error(`Senha incorreta (${tentativas}/${ContaBancaria.MAX_TENTATIVAS})`);
        }
        
        ContaBancaria.#tentativasLogin.set(this, 0);
    }
    
    #registrarTransacao(tipo, valor) {
        this.#transacoes.push({
            tipo,
            valor,
            saldo: this.#saldo,
            data: new Date()
        });
    }
    
    depositar(valor, senha) {
        this.#validarSenha(senha);
        if (valor <= 0) throw new Error("Valor inválido");
        
        this.#saldo += valor;
        this.#registrarTransacao('depósito', valor);
        return this.#saldo;
    }
    
    sacar(valor, senha) {
        this.#validarSenha(senha);
        if (valor <= 0) throw new Error("Valor inválido");
        if (valor > this.#saldo) throw new Error("Saldo insuficiente");
        
        this.#saldo -= valor;
        this.#registrarTransacao('saque', valor);
        return this.#saldo;
    }
    
    consultarSaldo(senha) {
        this.#validarSenha(senha);
        return this.#saldo;
    }
    
    get titular() {
        return this.#titular;
    }
}

// Usando o sistema
const conta = new ContaBancaria("João Silva", "senha123", 1000);

console.log("Titular:", conta.titular);
conta.depositar(500, "senha123");
console.log("Saldo após depósito:", conta.consultarSaldo("senha123"));

try {
    conta.sacar(100, "senhaErrada");
} catch (e) {
    console.log("Erro:", e.message);
}

conta.sacar(200, "senha123");
console.log("Saldo final:", conta.consultarSaldo("senha123"));

console.log("\n✅ Sistema com segurança e privacy total!");
```

---

## 📚 Conclusão

**Privacy em JavaScript** evoluiu significativamente, oferecendo múltiplas técnicas com diferentes níveis de proteção e complexidade.

**Principais Aprendizados:**
- **Private Fields (#)**: Melhor opção para código moderno
- **WeakMaps**: Excelente para bibliotecas
- **Closures**: Universal mas com trade-offs de memória
- **Symbols**: Privacidade leve
- **Convention (_)**: Sem privacidade real

Escolha a técnica baseada em: **compatibilidade**, **nível de proteção** necessário, **performance** e **complexidade** aceitável.
