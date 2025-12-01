# Boas Práticas de Nomenclatura: Identidade Semântica e Convenções

## 🎯 Introdução e Definição

Boas práticas de nomenclatura são **convenções estabelecidas pela comunidade** para nomear variáveis de forma clara, consistente e semanticamente significativa, facilitando leitura, manutenção e colaboração em código TypeScript. Conceitualmente, nomes são **contratos de intenção**: comunicam propósito, escopo e natureza da variável para humanos e ferramentas.

## 📋 Sumário Conceitual

**Princípios Fundamentais:**
1. **Clareza sobre Brevidade:** Nome descritivo > abreviação obscura
2. **Convenções Consistentes:** Seguir padrões da comunidade
3. **Contexto Relevante:** Nome apropriado ao escopo e vida útil
4. **Semântica sobre Sintaxe:** Revelar intenção, não implementação

## 🧠 Convenções de Nomenclatura

### Casos de Nomenclatura (Casing)

**camelCase (Variáveis e Funções):**
```typescript
let nomeCompleto = "João Silva";
const idadeAtual = 30;
function calcularTotal() { }
const obterUsuario = () => { };
```

**PascalCase (Classes, Interfaces, Types):**
```typescript
class UsuarioService { }
interface ConfiguracaoAPI { }
type ResultadoBusca = { };
```

**UPPER_SNAKE_CASE (Constantes Globais):**
```typescript
const MAX_TENTATIVAS = 5;
const API_BASE_URL = "https://api.com";
const TIMEOUT_PADRAO_MS = 30000;
```

**snake_case (Evitar):**
Não é convenção JavaScript/TypeScript. Use em SQL, Python, mas não aqui.

### Nomenclatura por Tipo de Variável

**Booleanos (Prefixos):**
```typescript
// is, has, can, should
const isAtivo = true;
const hasPermissao = false;
const canEdit = true;
const shouldUpdate = false;
```

**Arrays (Plural):**
```typescript
const usuarios = [...];
const itens = [...];
const configuracoes = [...];
```

**Objetos de Configuração:**
```typescript
const config = { };
const options = { };
const settings = { };
```

**Contadores e Índices:**
```typescript
let contador = 0;
let indice = 0;
for (let i = 0; i < array.length; i++) { }
```

**Funções (Verbos):**
```typescript
function calcular() { }
function obter() { }
function validar() { }
const processar = () => { };
```

**Constantes de Enumeração:**
```typescript
const StatusPedido = {
  Pendente: "PENDENTE",
  Processando: "PROCESSANDO",
  Concluido: "CONCLUIDO"
} as const;
```

### Comprimento de Nomes

**Escopo Curto → Nome Curto:**
```typescript
for (let i = 0; i < 10; i++) {  // 'i' OK em loop
  // ...
}

array.map((item, index) => { });  // item, index OK em callback
```

**Escopo Longo → Nome Descritivo:**
```typescript
const configuracaoConexaoBancoDados = { };
const listaUsuariosAtivosComPermissaoAdmin = [ ];
```

**Regra:** Nome deve ser tão longo quanto necessário para clareza, mas não mais.

### Nomes a Evitar

**Genéricos Demais:**
```typescript
// ❌ Evitar
let data;
let info;
let temp;
let value;

// ✅ Preferir
let dataVencimento;
let informacoesUsuario;
let temperaturaAtual;
let valorTotal;
```

**Abreviações Obscuras:**
```typescript
// ❌ Evitar
let usrCfg;
let tmpVal;

// ✅ Preferir
let usuarioConfiguracao;
let valorTemporario;
```

**Nomes Enganosos:**
```typescript
// ❌ Confuso (não é array)
let usuarios = { id: 1, nome: "João" };

// ✅ Claro
let usuario = { id: 1, nome: "João" };
```

## 🎯 Padrões Específicos TypeScript

### Tipos vs. Valores

**Mesmo Nome para Tipo e Valor:**
```typescript
interface Usuario { nome: string; }
const usuario: Usuario = { nome: "João" };
```

**Convenção:** TypeScript permite mesmo nome (contextos diferentes).

### Generics

**Convenção:**
```typescript
// Single letter para genéricos simples
function identidade<T>(valor: T): T { }

// Nomes descritivos para complexos
function mapear<TEntrada, TSaida>(fn: (v: TEntrada) => TSaida) { }
```

### Prefixos de Interface

**Debate:** `I` prefix ou não?

```typescript
// Estilo C#/Java (menos comum em TS)
interface IUsuario { }

// Estilo TypeScript moderno (preferido)
interface Usuario { }
```

**Recomendação:** Sem prefixo `I` em TypeScript moderno.

## 🎯 Contextos Específicos

**APIs Públicas:**
Nomes descritivos completos, documentados.

**Implementação Interna:**
Pode ser mais conciso se escopo é pequeno.

**Parâmetros de Função:**
```typescript
// Descritivos se função complexa
function processarPagamento(
  valorTotal: number,
  metodoPagamento: string,
  informacoesCartao: CartaoCredito
) { }

// Concisos em callbacks simples
array.map(item => item.nome);
```

## ⚠️ Armadilhas

**1. Sobre-Abreviação:**
```typescript
let usrNm = "João";  // ❌ Difícil ler
let nomeUsuario = "João";  // ✅
```

**2. Redundância:**
```typescript
let usuarioObjeto = { };  // ❌ "Objeto" redundante
let usuario = { };  // ✅
```

**3. Inconsistência:**
```typescript
let userName = "João";
let idade_usuario = 30;  // ❌ Mixing styles
```

## 📚 Conclusão

**Boas práticas de nomenclatura** transformam código de sequência de instruções em narrativa legível. Nomes claros, consistentes e semânticos são **documentação viva** que facilita compreensão e manutenção.

**Regras de Ouro:**
1. **camelCase** para variáveis/funções
2. **PascalCase** para tipos/classes
3. **UPPER_SNAKE_CASE** para constantes globais
4. **Clareza** sobre brevidade
5. **Consistência** acima de preferência pessoal

**Código é lido 10x mais que escrito - invista em nomes bons.**
