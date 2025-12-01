# Namespace Pattern: Organização Hierárquica e Prevenção de Conflitos

## 🎯 Introdução e Definição

### Definição Conceitual

O **Namespace Pattern** é um padrão de organização de código que cria **estruturas hierárquicas** de objetos para agrupar funcionalidades relacionadas, evitando **conflitos de nomes** no escopo global e proporcionando uma **organização lógica** que espelha a arquitetura da aplicação.

Conceitualmente, namespaces implementam **hierarchical organization** (organização hierárquica) - criando uma árvore de módulos onde cada nó representa um contexto específico, similar aos pacotes em Java ou namespaces em C#. Isso transforma código plano e desorganizado em uma **estrutura navegável e autoexplicativa**.

### Contexto Histórico e Motivação

O Namespace Pattern surgiu como solução para problemas de organização em aplicações JavaScript crescentes:

**1. Global Namespace Pollution:** Tudo no JavaScript compartilha o mesmo escopo global
**2. Name Conflicts:** Colisões de nomes entre bibliotecas e código próprio
**3. Code Organization:** Dificuldade em estruturar aplicações grandes
**4. Discoverability:** Dificuldade em encontrar funcionalidades relacionadas
**5. Team Coordination:** Conflitos em equipes trabalhando no mesmo código

**Evolução histórica:**

- **Início dos anos 2000:** Problema começou com aplicações web maiores
- **2005-2010:** Bibliotecas como Yahoo! UI adotaram namespaces
- **jQuery Era:** `$.fn` é exemplo clássico de namespace
- **Backbone/Angular 1:** Amplo uso de namespaces organizacionais
- **ES6 (2015):** Modules reduziram necessidade, mas conceito permanece
- **Atualidade:** Ainda relevante para código browser-only e organização

### Problema Fundamental que Resolve

O Namespace Pattern resolve problemas críticos de **organização** e **colisão**:

**1. Name Conflicts:** Evita sobrescrita acidental de variáveis/funções
**2. Global Pollution:** Minimiza variáveis no escopo global (idealmente uma)
**3. Logical Grouping:** Agrupa funcionalidades relacionadas
**4. Discoverability:** Torna código mais navegável e compreensível
**5. Team Scaling:** Permite que times trabalhem em namespaces separados

### Importância no Ecossistema

O Namespace Pattern é **essencial** para:

- **Legacy Code:** Compreensão de código pré-ES6
- **Library Design:** Muitas bibliotecas usam namespaces (`jQuery`, `Lodash`, `D3`)
- **Browser Scripts:** Código sem build tools precisa evitar conflitos
- **Architectural Organization:** Espelhar estrutura de pastas em código
- **Plugin Systems:** Isolar plugins e extensões

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Single Global Variable:** Apenas um nome no escopo global
2. **Hierarchical Structure:** Organização em níveis (tree-like)
3. **Dot Notation Access:** Navegação via `objeto.propriedade`
4. **Namespace Collision Avoidance:** Prevenção de conflitos de nomes
5. **Logical Grouping:** Agrupamento por domínio/funcionalidade

### Pilares Fundamentais

- **Object Nesting:** Objetos dentro de objetos formam hierarquia
- **Lazy Initialization:** Criar namespaces apenas quando necessário
- **Namespace Augmentation:** Estender namespaces existentes
- **Safe Extension:** Verificar existência antes de criar
- **Deep Nesting:** Múltiplos níveis de organização

### Visão Geral das Nuances

- **Flat vs Nested:** Trade-offs entre profundidade e simplicidade
- **Naming Conventions:** Convenções para nomear namespaces
- **Initialization Patterns:** Diferentes formas de criar estrutura
- **Module Integration:** Combinar com Module Pattern
- **Performance:** Impacto de acesso profundo

---

## 🧠 Fundamentos Teóricos

### Namespace Básico

#### Estrutura Simples

```javascript
console.log("=== NAMESPACE BÁSICO ===\n");

// ❌ SEM NAMESPACE: Poluição global
console.log("1. Sem namespace (problemático):");

var validarEmail = function(email) {
    return email.includes('@');
};

var validarSenha = function(senha) {
    return senha.length >= 8;
};

var formatarData = function(data) {
    return data.toLocaleDateString();
};

console.log("  Variáveis globais criadas: validarEmail, validarSenha, formatarData");
console.log("  ✗ Risco de conflito se outra biblioteca usar mesmos nomes!");

// ✅ COM NAMESPACE: Organização limpa
console.log("\n2. Com namespace (organizado):");

// Criar namespace único no global
var MeuApp = MeuApp || {};

// Agrupar funcionalidades
MeuApp.Validacao = {
    email: function(email) {
        return email.includes('@');
    },
    
    senha: function(senha) {
        return senha.length >= 8;
    }
};

MeuApp.Formatacao = {
    data: function(data) {
        return data.toLocaleDateString();
    },
    
    moeda: function(valor) {
        return `R$ ${valor.toFixed(2)}`;
    }
};

console.log("  Variável global criada: apenas 'MeuApp'");
console.log("  Validar email:", MeuApp.Validacao.email('teste@email.com'));
console.log("  Validar senha:", MeuApp.Validacao.senha('12345678'));
console.log("  Formatar data:", MeuApp.Formatacao.data(new Date()));
console.log("  Formatar moeda:", MeuApp.Formatacao.moeda(1234.56));
console.log("  ✓ Organizado e sem conflitos!");
```

### Namespace Hierárquico

#### Estrutura em Múltiplos Níveis

```javascript
console.log("\n=== NAMESPACE HIERÁRQUICO ===\n");

// Criar estrutura hierárquica completa
var Sistema = {
    // Nível 1: Domínios principais
    Autenticacao: {
        // Nível 2: Subdomínios
        Usuario: {
            // Nível 3: Funcionalidades específicas
            login: function(usuario, senha) {
                console.log(`Login: ${usuario}`);
                return { sucesso: true, token: 'abc123' };
            },
            
            logout: function(token) {
                console.log(`Logout: token ${token}`);
                return { sucesso: true };
            },
            
            registrar: function(dados) {
                console.log(`Novo usuário: ${dados.nome}`);
                return { id: 1, nome: dados.nome };
            }
        },
        
        Sessao: {
            criar: function(usuarioId) {
                console.log(`Sessão criada para usuário ${usuarioId}`);
                return { sessaoId: 's123', expira: Date.now() + 3600000 };
            },
            
            validar: function(sessaoId) {
                console.log(`Validando sessão ${sessaoId}`);
                return true;
            },
            
            destruir: function(sessaoId) {
                console.log(`Sessão ${sessaoId} destruída`);
            }
        }
    },
    
    Dados: {
        API: {
            get: function(endpoint) {
                console.log(`GET ${endpoint}`);
                return { dados: [] };
            },
            
            post: function(endpoint, dados) {
                console.log(`POST ${endpoint}`, dados);
                return { sucesso: true };
            }
        },
        
        Cache: {
            set: function(chave, valor) {
                console.log(`Cache SET: ${chave}`);
            },
            
            get: function(chave) {
                console.log(`Cache GET: ${chave}`);
                return null;
            }
        }
    },
    
    UI: {
        Componentes: {
            Button: function(texto) {
                return `<button>${texto}</button>`;
            },
            
            Input: function(tipo, placeholder) {
                return `<input type="${tipo}" placeholder="${placeholder}">`;
            }
        },
        
        Modal: {
            abrir: function(conteudo) {
                console.log(`Modal aberto: ${conteudo}`);
            },
            
            fechar: function() {
                console.log(`Modal fechado`);
            }
        }
    }
};

// Usando a estrutura hierárquica
console.log("1. Autenticação:");
Sistema.Autenticacao.Usuario.login('admin', '123456');
const sessao = Sistema.Autenticacao.Sessao.criar(1);

console.log("\n2. Dados:");
Sistema.Dados.API.get('/usuarios');
Sistema.Dados.Cache.set('user_1', { nome: 'João' });

console.log("\n3. UI:");
console.log("  Botão:", Sistema.UI.Componentes.Button('Clique Aqui'));
Sistema.UI.Modal.abrir('Bem-vindo!');

console.log("\n✓ Estrutura organizada em 3 níveis!");
```

### Safe Namespace Creation

#### Criação Segura e Extensível

```javascript
console.log("\n=== CRIAÇÃO SEGURA DE NAMESPACES ===\n");

// Padrão 1: Verificação simples
console.log("1. Verificação simples:");

var App = App || {};

App.Utils = App.Utils || {};

App.Utils.String = {
    capitalize: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};

console.log("  App.Utils.String criado com segurança");

// Padrão 2: Função helper para criar namespaces
console.log("\n2. Função helper:");

function namespace(ns) {
    var partes = ns.split('.');
    var objeto = window;
    
    for (var i = 0; i < partes.length; i++) {
        var parte = partes[i];
        
        if (typeof objeto[parte] === 'undefined') {
            objeto[parte] = {};
        }
        
        objeto = objeto[parte];
    }
    
    return objeto;
}

// Criar múltiplos níveis de uma vez
namespace('Empresa.Produto.Modulo.Funcionalidade');

console.log("  Namespace criado:", typeof Empresa.Produto.Modulo.Funcionalidade);

// Adicionar funcionalidade
namespace('Empresa.Produto.Modulo.Funcionalidade').processar = function() {
    console.log("  Processando...");
};

Empresa.Produto.Modulo.Funcionalidade.processar();

// Padrão 3: IIFE para namespace protegido
console.log("\n3. IIFE para namespace protegido:");

var Biblioteca = Biblioteca || {};

Biblioteca.Math = (function() {
    // Variáveis privadas
    var PI = 3.14159;
    
    // Funções privadas
    function validarNumero(n) {
        return typeof n === 'number' && !isNaN(n);
    }
    
    // API pública no namespace
    return {
        area: {
            circulo: function(raio) {
                if (!validarNumero(raio)) {
                    throw new Error('Raio inválido');
                }
                return PI * raio * raio;
            },
            
            quadrado: function(lado) {
                if (!validarNumero(lado)) {
                    throw new Error('Lado inválido');
                }
                return lado * lado;
            }
        },
        
        perimetro: {
            circulo: function(raio) {
                if (!validarNumero(raio)) {
                    throw new Error('Raio inválido');
                }
                return 2 * PI * raio;
            },
            
            quadrado: function(lado) {
                if (!validarNumero(lado)) {
                    throw new Error('Lado inválido');
                }
                return 4 * lado;
            }
        }
    };
})();

console.log("  Área do círculo (r=5):", Biblioteca.Math.area.circulo(5));
console.log("  Perímetro do quadrado (l=4):", Biblioteca.Math.perimetro.quadrado(4));
console.log("  ✓ Namespace com privacidade via IIFE");
```

### Namespace Augmentation

#### Estendendo Namespaces Existentes

```javascript
console.log("\n=== NAMESPACE AUGMENTATION ===\n");

// Base inicial
var Framework = Framework || {};

Framework.Core = {
    versao: '1.0.0',
    
    log: function(mensagem) {
        console.log(`[Framework] ${mensagem}`);
    }
};

console.log("1. Framework inicial:");
console.log("  Versão:", Framework.Core.versao);
Framework.Core.log("Sistema iniciado");

// Augmentation 1: Adicionar novo módulo
console.log("\n2. Adicionando módulo 'Utils':");

Framework.Utils = Framework.Utils || {};

Framework.Utils.Array = {
    primeiro: function(arr) {
        return arr[0];
    },
    
    ultimo: function(arr) {
        return arr[arr.length - 1];
    }
};

console.log("  Primeiro de [1,2,3]:", Framework.Utils.Array.primeiro([1,2,3]));
console.log("  Último de [1,2,3]:", Framework.Utils.Array.ultimo([1,2,3]));

// Augmentation 2: Estender módulo existente
console.log("\n3. Estendendo módulo 'Core':");

Framework.Core.info = function() {
    return {
        versao: Framework.Core.versao,
        modulos: Object.keys(Framework),
        total: Object.keys(Framework).length
    };
};

console.log("  Info:", Framework.Core.info());

// Augmentation 3: Tight Augmentation (importar dependências)
console.log("\n4. Tight Augmentation:");

Framework.Avancado = (function(core, utils) {
    // Usar funcionalidades de outros módulos
    return {
        processar: function(dados) {
            core.log("Processando dados...");
            
            if (Array.isArray(dados)) {
                return {
                    primeiro: utils.Array.primeiro(dados),
                    ultimo: utils.Array.ultimo(dados),
                    total: dados.length
                };
            }
            
            return null;
        }
    };
})(Framework.Core, Framework.Utils);

console.log("  Processar [10,20,30]:", 
            Framework.Avancado.processar([10,20,30]));

console.log("\n✓ Framework estendido com múltiplos módulos!");
```

---

## 🔍 Análise Conceitual Profunda

### Convenções de Nomenclatura

#### Naming Best Practices

```javascript
console.log("\n=== CONVENÇÕES DE NOMENCLATURA ===\n");

// ✅ BOM: Nomes claros e hierárquicos
var ComercioEletronico = {
    // PascalCase para namespaces principais
    Catalogo: {
        Produtos: {
            listar: function() { /* ... */ },
            buscar: function(id) { /* ... */ }
        },
        
        Categorias: {
            obterTodas: function() { /* ... */ }
        }
    },
    
    Carrinho: {
        itens: [],
        
        adicionar: function(produto) { /* ... */ },
        remover: function(produtoId) { /* ... */ },
        total: function() { /* ... */ }
    },
    
    Pagamento: {
        Cartao: {
            validar: function(numero) { /* ... */ },
            processar: function(dados) { /* ... */ }
        },
        
        Boleto: {
            gerar: function() { /* ... */ }
        }
    }
};

console.log("1. Estrutura bem nomeada:");
console.log("  ComercioEletronico.Catalogo.Produtos");
console.log("  ComercioEletronico.Carrinho");
console.log("  ComercioEletronico.Pagamento.Cartao");
console.log("  ✓ Nomes descritivos e hierárquicos");

// ❌ RUIM: Nomes confusos e flat
var app = {
    p: { /* produtos */ },
    c: { /* carrinho */ },
    pag: { /* pagamento */ },
    utils: { /* utilitários */ }
};

console.log("\n2. Estrutura mal nomeada:");
console.log("  app.p, app.c, app.pag");
console.log("  ✗ Difícil de entender e manter");

// Convenções recomendadas
console.log("\n3. Convenções recomendadas:");
console.log("  • PascalCase para namespaces: MeuApp.GerenciarUsuarios");
console.log("  • camelCase para métodos: usuario.obterNome()");
console.log("  • Prefixos para escopo: $ para jQuery, _ para Lodash");
console.log("  • Singular vs Plural: Utils (coleção), Usuario (instância)");
console.log("  • Evitar abreviações: usar 'Autenticacao' não 'Auth'");
```

### Profundidade vs Simplicidade

#### Balancing Hierarchy Depth

```javascript
console.log("\n=== PROFUNDIDADE VS SIMPLICIDADE ===\n");

// ❌ MUITO PROFUNDO: Difícil de usar
var SistemaComplexo = {
    Empresa: {
        Departamento: {
            Recursos: {
                Humanos: {
                    Funcionarios: {
                        Gerenciamento: {
                            Cadastro: {
                                adicionar: function() {
                                    console.log("Caminho muito profundo!");
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

console.log("1. Muito profundo (7 níveis):");
SistemaComplexo.Empresa.Departamento.Recursos.Humanos.Funcionarios.Gerenciamento.Cadastro.adicionar();
console.log("  ✗ Difícil de digitar e lembrar");

// ✅ BALANCEADO: 2-3 níveis ideais
var Sistema = {
    RH: {
        Funcionarios: {
            adicionar: function(dados) {
                console.log("  Funcionário adicionado:", dados.nome);
            },
            
            remover: function(id) {
                console.log("  Funcionário removido:", id);
            },
            
            listar: function() {
                console.log("  Listando funcionários...");
            }
        },
        
        Departamentos: {
            criar: function(nome) {
                console.log("  Departamento criado:", nome);
            }
        }
    },
    
    Financeiro: {
        Pagamentos: {
            processar: function() { /* ... */ }
        },
        
        Relatorios: {
            gerar: function() { /* ... */ }
        }
    }
};

console.log("\n2. Balanceado (2-3 níveis):");
Sistema.RH.Funcionarios.adicionar({ nome: 'João' });
Sistema.RH.Departamentos.criar('TI');
console.log("  ✓ Fácil de usar e compreender");

// Regra de ouro
console.log("\n3. Regra de ouro:");
console.log("  • 2 níveis: ideal para maioria dos casos");
console.log("  • 3 níveis: aceitável para sistemas médios");
console.log("  • 4+ níveis: considere refatorar");
console.log("  • Se difícil de digitar, está muito profundo");
```

### Performance Considerations

#### Impact of Deep Access

```javascript
console.log("\n=== CONSIDERAÇÕES DE PERFORMANCE ===\n");

// Setup
var Profundo = {
    Nivel1: {
        Nivel2: {
            Nivel3: {
                Nivel4: {
                    Nivel5: {
                        metodo: function() {
                            return "Resultado";
                        }
                    }
                }
            }
        }
    }
};

// ❌ Acesso profundo repetido
console.log("1. Acesso profundo repetido:");
console.time("Acesso profundo");

for (let i = 0; i < 100000; i++) {
    Profundo.Nivel1.Nivel2.Nivel3.Nivel4.Nivel5.metodo();
}

console.timeEnd("Acesso profundo");
console.log("  ✗ Cada acesso percorre toda a cadeia");

// ✅ Cache de referência
console.log("\n2. Cache de referência:");
console.time("Acesso com cache");

const metodoCached = Profundo.Nivel1.Nivel2.Nivel3.Nivel4.Nivel5.metodo;

for (let i = 0; i < 100000; i++) {
    metodoCached();
}

console.timeEnd("Acesso com cache");
console.log("  ✓ Referência direta, muito mais rápido");

// Best practice
console.log("\n3. Best practice:");
console.log("  • Cache referências usadas em loops");
console.log("  • Evite acesso profundo em hot paths");
console.log("  • Considere aliases para caminhos longos");

// Aliases
const RH = Sistema.RH;
const Funcionarios = Sistema.RH.Funcionarios;

console.log("\n4. Usando aliases:");
Funcionarios.adicionar({ nome: 'Maria' });
console.log("  ✓ Mais legível e performático");
```

---

## 🎯 Padrões Avançados

### Namespace Factory

#### Creating Multiple Instances

```javascript
console.log("\n=== NAMESPACE FACTORY ===\n");

// Factory para criar namespaces configuráveis
function criarAplicacao(nome, config) {
    const app = {
        nome: nome,
        versao: config.versao || '1.0.0',
        
        // Namespaces padrão
        Core: {},
        Utils: {},
        Plugins: {},
        
        // Métodos do app
        info: function() {
            return `${this.nome} v${this.versao}`;
        },
        
        registrarPlugin: function(nomePlugin, plugin) {
            this.Plugins[nomePlugin] = plugin;
            console.log(`  Plugin '${nomePlugin}' registrado`);
        }
    };
    
    return app;
}

// Criar múltiplas aplicações
console.log("1. Criando aplicações:");

const App1 = criarAplicacao('Sistema Admin', { versao: '2.0.0' });
const App2 = criarAplicacao('Sistema Cliente', { versao: '1.5.0' });

console.log("  App1:", App1.info());
console.log("  App2:", App2.info());

// Registrar plugins
console.log("\n2. Registrando plugins:");

App1.registrarPlugin('Auth', {
    login: function() { console.log("    Login no Admin"); }
});

App2.registrarPlugin('Checkout', {
    finalizar: function() { console.log("    Finalizando compra"); }
});

App1.Plugins.Auth.login();
App2.Plugins.Checkout.finalizar();

console.log("\n✓ Múltiplas instâncias independentes!");
```

### Namespace Loader

#### Dynamic Namespace Loading

```javascript
console.log("\n=== NAMESPACE LOADER ===\n");

var AppLoader = (function() {
    const modulos = {};
    
    return {
        // Registrar módulo
        registrar: function(caminho, modulo) {
            const partes = caminho.split('.');
            let atual = modulos;
            
            for (let i = 0; i < partes.length - 1; i++) {
                const parte = partes[i];
                
                if (!atual[parte]) {
                    atual[parte] = {};
                }
                
                atual = atual[parte];
            }
            
            const ultimaParte = partes[partes.length - 1];
            atual[ultimaParte] = modulo;
            
            console.log(`  ✓ Módulo '${caminho}' registrado`);
        },
        
        // Obter módulo
        obter: function(caminho) {
            const partes = caminho.split('.');
            let atual = modulos;
            
            for (let i = 0; i < partes.length; i++) {
                if (!atual[partes[i]]) {
                    return null;
                }
                atual = atual[partes[i]];
            }
            
            return atual;
        },
        
        // Listar módulos
        listar: function(prefixo = '') {
            function recursivo(obj, caminho) {
                const lista = [];
                
                for (let chave in obj) {
                    const novoCaminho = caminho ? `${caminho}.${chave}` : chave;
                    
                    if (typeof obj[chave] === 'object' && !Array.isArray(obj[chave])) {
                        lista.push(novoCaminho);
                        lista.push(...recursivo(obj[chave], novoCaminho));
                    }
                }
                
                return lista;
            }
            
            return recursivo(modulos, prefixo);
        }
    };
})();

// Registrar módulos dinamicamente
console.log("1. Registrando módulos:");

AppLoader.registrar('Auth.Usuario', {
    login: function() { return 'login'; }
});

AppLoader.registrar('Auth.Sessao', {
    criar: function() { return 'sessão criada'; }
});

AppLoader.registrar('Dados.API', {
    get: function() { return 'dados'; }
});

// Usar módulos
console.log("\n2. Usando módulos:");
const authUsuario = AppLoader.obter('Auth.Usuario');
console.log("  Login:", authUsuario.login());

// Listar módulos
console.log("\n3. Módulos registrados:");
const lista = AppLoader.listar();
lista.forEach(m => console.log(`  • ${m}`));

console.log("\n✓ Sistema de carregamento dinâmico!");
```

---

## ⚠️ Armadilhas Comuns

### Problemas e Soluções

```javascript
console.log("\n=== ARMADILHAS COMUNS ===\n");

// ❌ ERRO 1: Sobrescrever namespace existente
console.log("1. Sobrescrita acidental:");

var Lib = {
    Utils: {
        string: { /* ... */ }
    }
};

console.log("  Antes:", Object.keys(Lib.Utils));

// ❌ Sobrescreve completamente
Lib.Utils = {
    array: { /* ... */ }
};

console.log("  Depois:", Object.keys(Lib.Utils));
console.log("  ✗ Utils.string foi perdido!");

// ✅ Solução: Sempre verificar existência
Lib.Utils = Lib.Utils || {};
Lib.Utils.array = { /* ... */ };

// ❌ ERRO 2: Esquecer inicialização
console.log("\n2. Namespace não inicializado:");

try {
    App.Modulo.Submodulo.metodo(); // ❌ App não existe
} catch (e) {
    console.log("  Erro:", e.message);
}

// ✅ Solução: Inicializar todos os níveis
var App = App || {};
App.Modulo = App.Modulo || {};
App.Modulo.Submodulo = {
    metodo: function() {
        console.log("  ✓ Funciona!");
    }
};

App.Modulo.Submodulo.metodo();

// ❌ ERRO 3: Circular dependencies
console.log("\n3. Dependências circulares:");
console.log("  ModuloA depende de ModuloB");
console.log("  ModuloB depende de ModuloA");
console.log("  ✗ Pode causar problemas de inicialização!");
console.log("\n  Solução: Reestruturar para eliminar circularidade");
```

---

## 🔗 Relações e Conexões

### Integração com Outros Conceitos

**Conceitos Relacionados:**

- **Module Pattern:** Namespace + encapsulamento via IIFE
- **Object Literals:** Base técnica dos namespaces
- **Singleton Pattern:** Namespace é naturalmente singleton
- **Plugin Architecture:** Namespaces para plugins
- **ES6 Modules:** Evolução moderna do conceito

**Próximos Passos:**

- Privacy em JavaScript (encapsulamento avançado)
- Module Bundlers (Webpack, Rollup)
- ES6 Module System (import/export)
- Dependency Injection
- Microservices Architecture

---

## 🚀 Exemplo Prático Avançado

### Sistema Completo de E-commerce

```javascript
console.log("\n=== SISTEMA E-COMMERCE COMPLETO ===\n");

var ECommerce = (function() {
    // Namespace raiz
    var app = {
        versao: '1.0.0'
    };
    
    // === CATÁLOGO ===
    app.Catalogo = (function() {
        const produtos = [
            { id: 1, nome: 'Notebook', preco: 3000 },
            { id: 2, nome: 'Mouse', preco: 50 },
            { id: 3, nome: 'Teclado', preco: 150 }
        ];
        
        return {
            listar: function() {
                return produtos.map(p => ({...p}));
            },
            
            buscar: function(id) {
                return produtos.find(p => p.id === id);
            }
        };
    })();
    
    // === CARRINHO ===
    app.Carrinho = (function() {
        const itens = [];
        
        return {
            adicionar: function(produtoId, quantidade = 1) {
                const produto = app.Catalogo.buscar(produtoId);
                
                if (!produto) {
                    throw new Error(`Produto ${produtoId} não encontrado`);
                }
                
                itens.push({
                    produto: produto,
                    quantidade: quantidade
                });
                
                console.log(`  ✓ ${produto.nome} adicionado ao carrinho`);
            },
            
            remover: function(produtoId) {
                const indice = itens.findIndex(i => i.produto.id === produtoId);
                
                if (indice !== -1) {
                    const removido = itens.splice(indice, 1)[0];
                    console.log(`  ✓ ${removido.produto.nome} removido do carrinho`);
                }
            },
            
            listar: function() {
                return itens.map(i => ({
                    nome: i.produto.nome,
                    preco: i.produto.preco,
                    quantidade: i.quantidade,
                    subtotal: i.produto.preco * i.quantidade
                }));
            },
            
            total: function() {
                return itens.reduce((soma, item) => {
                    return soma + (item.produto.preco * item.quantidade);
                }, 0);
            },
            
            limpar: function() {
                itens.length = 0;
                console.log("  ✓ Carrinho limpo");
            }
        };
    })();
    
    // === PAGAMENTO ===
    app.Pagamento = {
        Cartao: {
            validar: function(numero) {
                return numero.length === 16;
            },
            
            processar: function(dados) {
                if (!this.validar(dados.numero)) {
                    throw new Error("Cartão inválido");
                }
                
                const total = app.Carrinho.total();
                console.log(`  ✓ Pagamento de R$ ${total.toFixed(2)} processado`);
                
                return {
                    sucesso: true,
                    transacao: 'TXN' + Date.now()
                };
            }
        },
        
        Boleto: {
            gerar: function() {
                const total = app.Carrinho.total();
                console.log(`  ✓ Boleto de R$ ${total.toFixed(2)} gerado`);
                
                return {
                    codigo: 'BOL' + Date.now(),
                    vencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                };
            }
        }
    };
    
    // === PEDIDO ===
    app.Pedido = (function() {
        let proximoId = 1;
        const pedidos = [];
        
        return {
            criar: function(formaPagamento, dadosPagamento) {
                const itens = app.Carrinho.listar();
                const total = app.Carrinho.total();
                
                if (itens.length === 0) {
                    throw new Error("Carrinho vazio");
                }
                
                // Processar pagamento
                let pagamento;
                if (formaPagamento === 'cartao') {
                    pagamento = app.Pagamento.Cartao.processar(dadosPagamento);
                } else if (formaPagamento === 'boleto') {
                    pagamento = app.Pagamento.Boleto.gerar();
                } else {
                    throw new Error("Forma de pagamento inválida");
                }
                
                // Criar pedido
                const pedido = {
                    id: proximoId++,
                    itens: itens,
                    total: total,
                    pagamento: pagamento,
                    data: new Date()
                };
                
                pedidos.push(pedido);
                app.Carrinho.limpar();
                
                console.log(`  ✓ Pedido #${pedido.id} criado com sucesso!`);
                return pedido;
            },
            
            listar: function() {
                return pedidos.map(p => ({...p}));
            }
        };
    })();
    
    return app;
})();

// === USANDO O SISTEMA ===
console.log("1. Listando produtos:");
const produtos = ECommerce.Catalogo.listar();
produtos.forEach(p => console.log(`  • ${p.nome}: R$ ${p.preco}`));

console.log("\n2. Adicionando ao carrinho:");
ECommerce.Carrinho.adicionar(1); // Notebook
ECommerce.Carrinho.adicionar(2, 2); // 2 Mouses

console.log("\n3. Itens no carrinho:");
const itens = ECommerce.Carrinho.listar();
itens.forEach(i => console.log(`  • ${i.nome} x${i.quantidade} = R$ ${i.subtotal}`));
console.log(`  Total: R$ ${ECommerce.Carrinho.total().toFixed(2)}`);

console.log("\n4. Finalizando pedido:");
const pedido = ECommerce.Pedido.criar('cartao', { numero: '1234567890123456' });
console.log(`  Pedido ID: ${pedido.id}`);
console.log(`  Transação: ${pedido.pagamento.transacao}`);

console.log("\n✅ Sistema completo de e-commerce com namespace pattern!");
```

---

## 📚 Conclusão

O **Namespace Pattern** é uma técnica fundamental de organização de código JavaScript que cria **estruturas hierárquicas** para evitar conflitos e melhorar a manutenibilidade. Embora ES6 modules sejam a abordagem moderna, o Namespace Pattern permanece **conceitualmente importante** e **praticamente relevante** em código browser-only e sistemas legados.

**Conceitos Essenciais:**

- **Single Global Variable:** Minimizar poluição global
- **Hierarchical Organization:** Estrutura em árvore navegável
- **Safe Extension:** Verificação antes de criar
- **Logical Grouping:** Agrupar funcionalidades relacionadas
- **Collision Avoidance:** Prevenção de conflitos de nomes

O domínio do Namespace Pattern prepara para compreender **arquitetura de aplicações**, **plugin systems**, **module bundlers**, e a transição para **ES6 modules**.
