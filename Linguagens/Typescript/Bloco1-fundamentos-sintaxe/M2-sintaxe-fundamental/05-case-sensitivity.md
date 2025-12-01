# Case Sensitivity em TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

Case sensitivity (sensibilidade a maiúsculas/minúsculas) em TypeScript refere-se à característica fundamental da linguagem de **distinguir identificadores baseados em diferenças de capitalização**. Conceitualmente, case sensitivity significa que `usuario`, `Usuario`, `USUARIO` e `uSuArIo` são tratados como **identificadores completamente distintos** - nomes de variáveis, funções, classes, tipos, ou qualquer outro símbolo no código que diferem apenas em capitalização são considerados entidades separadas e não intercambiáveis.

Na essência, case sensitivity é uma **regra de equivalência de símbolos** que define quando dois identificadores são considerados "o mesmo". Em linguagens case-sensitive (como TypeScript, JavaScript, Java, C++), a equivalência requer correspondência exata de cada caractere, incluindo sua capitalização. Em linguagens case-insensitive (como SQL, Visual Basic, Fortran), capitalização é ignorada na comparação de identificadores.

Mais profundamente, case sensitivity não é meramente uma característica sintática - ela carrega **implicações semânticas e pragmáticas** significativas. Permite que desenvolvedores usem convenções de nomenclatura (camelCase para variáveis, PascalCase para classes) para comunicar tipo e propósito de identificadores. Ao mesmo tempo, introduz potencial para erros sutis quando capitalização é acidentalmente inconsistente.

### Contexto Histórico e Motivação

A história da case sensitivity em linguagens de programação reflete decisões de design fundamentais:

**Era Unix e Linguagem C (1970s):**
C, desenvolvida por Dennis Ritchie para Unix, é case-sensitive. Esta escolha foi influenciada por:
- **Sistema de Arquivos Unix:** Case-sensitive (arquivo.txt ≠ Arquivo.txt)
- **Eficiência:** Não requer normalização de capitalização durante parsing
- **Expressividade:** Permite usar capitalização como ferramenta de comunicação

Unix e C estabeleceram precedente para muitas linguagens modernas.

**Linguagens Case-Insensitive (1960s-1990s):**
Linguagens como Fortran, COBOL, Pascal, Visual Basic optaram por case-insensitivity:
- **Facilidade de Uso:** Programadores iniciantes não precisavam lembrar capitalização exata
- **Era de Terminais Maiúsculos:** Terminais antigos suportavam apenas maiúsculas
- **Menos Erros Triviais:** Erros de capitalização não causavam bugs

**JavaScript (1995) - Herança C:**
Brendan Eich, ao criar JavaScript, modelou sintaxe após C e Java (ambas case-sensitive). JavaScript herdou case sensitivity completamente:
```javascript
var nome = 'Ana';
var Nome = 'Beto'; // Variável diferente!
```

Esta escolha alinha JavaScript com linguagens "industriais" da época (C, C++, Java) e com sistema de arquivos Unix (onde JavaScript originalmente rodava em servidores).

**TypeScript (2012) - Superconjunto JavaScript:**
TypeScript, sendo superconjunto de JavaScript, herda integralmente case sensitivity. Microsoft não modificou esta característica - TypeScript segue exatamente o comportamento de JavaScript.

**Motivação Conceitual:**
Case sensitivity permite **expressividade semântica através de convenções de nomenclatura**:
- `variavel` vs. `Variavel` podem coexistir sem ambiguidade
- Convenções como camelCase, PascalCase, UPPER_SNAKE_CASE tornam-se viáveis
- Capitalização comunica tipo (variável vs. classe vs. constante)

### Problema Fundamental que Resolve

Case sensitivity resolve (e cria) problemas específicos:

**1. Expressividade de Convenções:**
Permite usar capitalização para diferenciar categorias de identificadores:

```typescript
// Variável (camelCase)
let nomeUsuario = 'Ana';

// Classe/Interface (PascalCase)
class Usuario { }
interface UsuarioDTO { }

// Constante (UPPER_SNAKE_CASE)
const MAX_USUARIOS = 100;

// Tipo genérico (letra única maiúscula)
function mapear<T>(item: T): T { return item; }
```

Sem case sensitivity, essas convenções seriam impossíveis.

**2. Namespace Implícito por Capitalização:**
Permite usar mesmo "nome base" para conceitos relacionados:

```typescript
// Tipo e variável com mesmo nome base, diferentes capitalizações
type Usuario = { nome: string };
const usuario: Usuario = { nome: 'Ana' };

// Classe e instância
class Produto { }
const produto = new Produto();
```

**3. Compatibilidade com Sistema de Arquivos:**
Em sistemas case-sensitive (Linux, macOS moderno), nomes de arquivos/módulos respeitam capitalização:

```typescript
// usuario.ts vs Usuario.ts são arquivos diferentes
import { Usuario } from './Usuario'; // Importa Usuario.ts
import { processar } from './usuario'; // Importa usuario.ts
```

**Problema Criado:**

**1. Erros de Digitação:**
Capitalização incorreta causa erros:

```typescript
let nomeUsuario = 'Ana';
console.log(nomeusuario); // ReferenceError - 'nomeusuario' não definido
```

**2. Confusão em Equipes:**
Desenvolvedores podem criar identificadores similares acidentalmente:

```typescript
let usuario = { nome: 'Ana' };
let Usuario = { nome: 'Beto' }; // Variável diferente, pode confundir
```

### Importância no Ecossistema

Case sensitivity tem importância crítica no ecossistema TypeScript/JavaScript:

**1. Interoperabilidade com JavaScript:**
TypeScript compila para JavaScript, que é case-sensitive. Manter case sensitivity garante comportamento idêntico pré e pós-compilação.

**2. Convenções de Nomenclatura Universais:**
Toda comunidade TypeScript/JavaScript usa convenções baseadas em capitalização (camelCase para variáveis, PascalCase para classes). Estas convenções são possíveis apenas com case sensitivity.

**3. Compatibilidade de Sistema de Arquivos:**
Projetos TypeScript rodam em múltiplos sistemas operacionais:
- **Linux/Unix:** Case-sensitive (arquivo.ts ≠ Arquivo.ts)
- **Windows:** Case-insensitive por padrão (arquivo.ts = Arquivo.ts), mas pode ser case-sensitive em NTFS moderno
- **macOS:** Case-insensitive por padrão (HFS+), case-sensitive opcional (APFS)

Case sensitivity no código alinha com Linux/Unix, mas pode causar problemas no Windows.

**4. Sistema de Tipos:**
TypeScript usa capitalização em tipos e interfaces. Case sensitivity permite distinguir tipos:

```typescript
type usuario = string; // Tipo (convenção não padrão)
type Usuario = { nome: string }; // Tipo diferente
```

**5. Resolução de Módulos:**
Imports respeitam capitalização:

```typescript
import { Usuario } from './models/Usuario'; // Busca Usuario.ts
import { usuario } from './models/usuario'; // Busca usuario.ts - arquivo diferente
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Distinção de Identificadores:** `abc` ≠ `Abc` ≠ `ABC`
2. **Herança de JavaScript:** Comportamento idêntico a JavaScript ES6+
3. **Convenções de Nomenclatura:** camelCase, PascalCase, UPPER_SNAKE_CASE baseadas em case sensitivity
4. **Implicações em Tipos:** Tipos e valores podem ter nomes que diferem apenas em capitalização
5. **Compatibilidade de Sistema de Arquivos:** Problemas potenciais em sistemas case-insensitive

### Pilares Fundamentais

**Identificadores:**
- **Variáveis/Funções:** camelCase (`nomeCompleto`, `calcularTotal`)
- **Classes/Interfaces/Types:** PascalCase (`Usuario`, `ConfiguracaoApp`)
- **Constantes:** UPPER_SNAKE_CASE (`MAX_TENTATIVAS`, `API_URL`)
- **Genéricos:** Letra maiúscula única ou PascalCase (`T`, `TUsuario`)

**Regras de Comparação:**
- Comparação byte-a-byte de caracteres, incluindo capitalização
- Dois identificadores são iguais se e somente se cada caractere tem mesma capitalização

**Diferenciação:**
```typescript
let valor = 10; // Identificador: 'valor'
let Valor = 20; // Identificador: 'Valor' (diferente!)
let VALOR = 30; // Identificador: 'VALOR' (diferente!)
```

### Visão Geral das Nuances

**Palavras-chave são case-sensitive:**
```typescript
let x = 10; // 'let' minúsculo - OK
Let y = 20; // SyntaxError - 'Let' não é palavra-chave válida
```

**Tipos built-in são case-sensitive:**
```typescript
let nome: string = 'Ana'; // 'string' minúsculo - OK
let idade: String = 30; // 'String' (wrapper object) - diferente!
```

**Propriedades de objetos são case-sensitive:**
```typescript
const obj = { nome: 'Ana', Nome: 'Beto' };
console.log(obj.nome); // 'Ana'
console.log(obj.Nome); // 'Beto'
```

**Imports/Exports são case-sensitive:**
```typescript
export class Usuario { }
import { usuario } from './Usuario'; // Erro - 'usuario' não exportado
import { Usuario } from './Usuario'; // OK
```

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Para compreender case sensitivity profundamente, é essencial entender como compilador e runtime processam identificadores.

#### Processo de Tokenização

Quando compilador TypeScript processa código:

**1. Leitura de Caracteres:**
Código fonte é lido caractere por caractere. Cada caractere tem valor Unicode único que inclui informação de maiúscula/minúscula:
- 'a' = U+0061 (LATIN SMALL LETTER A)
- 'A' = U+0041 (LATIN CAPITAL LETTER A)

**2. Formação de Tokens:**
Caracteres são agrupados em tokens. Identificadores (nomes de variáveis, funções, etc.) são tokenizados preservando exatamente a capitalização:

```typescript
let nomeUsuario = 'Ana';
// Tokens: [LET, IDENTIFIER("nomeUsuario"), EQUALS, STRING("Ana"), SEMICOLON]
```

**3. Comparação de Identificadores:**
Quando compilador encontra uso de identificador, compara token atual com identificadores declarados usando comparação **case-sensitive** (byte-a-byte):

```typescript
let usuario = 'Ana';
console.log(Usuario); // ReferenceError

// Compilador compara:
// "Usuario" vs "usuario"
// U+0055... vs U+0075... (códigos diferentes)
// Não corresponde!
```

#### Tabela de Símbolos

Compilador mantém **tabela de símbolos** (symbol table) - estrutura de dados que mapeia identificadores para suas declarações:

```typescript
let nomeUsuario = 'Ana';
let NomeUsuario = 'Beto';

// Tabela de símbolos (simplificada):
{
  "nomeUsuario": { tipo: "string", escopo: "atual", ... },
  "NomeUsuario": { tipo: "string", escopo: "atual", ... }
}
```

Chaves na tabela são **case-sensitive** - "nomeUsuario" e "NomeUsuario" são entradas distintas.

#### Resolução de Tipos

Sistema de tipos TypeScript é case-sensitive:

```typescript
type usuario = string;
type Usuario = { nome: string };

const a: usuario = 'Ana'; // Tipo string
const b: Usuario = { nome: 'Beto' }; // Tipo objeto
```

Compilador mantém tipos em tabela separada, também case-sensitive.

### Princípios e Conceitos Subjacentes

#### 1. Princípio da Identidade Exata

Case sensitivity implementa princípio de **identidade exata** - dois símbolos são idênticos se e somente se são indistinguíveis em todos os aspectos, incluindo capitalização.

Este princípio contrasta com linguagens case-insensitive que usam **identidade normalizada** (ignoram capitalização).

#### 2. Capitalização como Metadado

Em TypeScript, capitalização carrega **informação semântica implícita**:
- `minuscula` → variável ou função
- `Maiuscula` → classe, interface, tipo
- `MAIUSCULA_COMPLETA` → constante

Esta convenção transforma capitalização em **metadado legível por humanos**.

#### 3. Separação de Namespaces por Capitalização

Case sensitivity permite criar **namespaces implícitos** através de capitalização:

```typescript
// Namespace de tipos (PascalCase)
type Usuario = { nome: string };

// Namespace de valores (camelCase)
const usuario: Usuario = { nome: 'Ana' };
```

Sem case sensitivity, seria impossível ter `Usuario` (tipo) e `usuario` (variável) simultaneamente.

### Relação com Outros Conceitos da Linguagem

#### Relação com Sistema de Módulos

Imports e exports são case-sensitive:

```typescript
// arquivo: Usuario.ts
export class Usuario { }

// arquivo: main.ts
import { Usuario } from './Usuario'; // OK - capitalização corresponde
import { usuario } from './Usuario'; // Erro - 'usuario' não exportado
```

Em sistemas case-insensitive (Windows), arquivo pode ser encontrado mesmo com capitalização errada no path, mas export deve corresponder exatamente.

#### Relação com Sistema de Tipos

Tipos e valores coexistem em namespaces separados, mas ambos respeitam case sensitivity:

```typescript
// Tipo
interface Pessoa { nome: string }

// Valor (função)
function Pessoa(nome: string) { return { nome }; }

// Ambos podem coexistir - namespaces diferentes
// Mas capitalização deve corresponder ao usar
const p: Pessoa = Pessoa('Ana'); // OK
```

#### Relação com Propriedades de Objeto

Propriedades de objetos são case-sensitive:

```typescript
const config = {
  url: 'http://api.com',
  URL: 'http://backup.com' // Propriedade diferente!
};

console.log(config.url); // 'http://api.com'
console.log(config.URL); // 'http://backup.com'
```

Esta característica vem do JavaScript subjacente.

#### Relação com Palavras-Chave

Todas as palavras-chave TypeScript/JavaScript devem estar em minúsculas:

```typescript
// Palavras-chave válidas (minúsculas)
let, const, var, function, class, interface, type, if, else, for, while

// Inválidas (capitalizadas)
Let, Const, Function, Class, If, For // SyntaxError
```

### Modelo Mental para Compreensão

#### Modelo do "Nome Exato"

Pense em identificadores como **nomes próprios exatos** - capitalização é parte intrínseca do nome:

```typescript
// Pessoas diferentes
let ana = 'desenvolvedora';
let Ana = 'gerente';
let ANA = 'diretora';

// Assim como "João" ≠ "joão" em lista de nomes
```

Qualquer variação de capitalização é nome diferente.

#### Modelo de "Etiquetas Coloridas"

Visualize capitalização como **cor da etiqueta**:

```typescript
// Etiqueta verde (minúscula)
let usuario = { };

// Etiqueta azul (PascalCase)
class Usuario { }

// Etiqueta vermelha (MAIÚSCULAS)
const USUARIO_PADRAO = { };
```

Cores diferentes = identificadores diferentes, mesmo que texto seja similar.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica e Casos de Uso

#### Variáveis e Constantes

**camelCase para Variáveis:**
```typescript
let nomeCompleto: string = 'Ana Silva';
let idadeAtual: number = 30;
const enderecoEmail: string = 'ana@exemplo.com';
```

**UPPER_SNAKE_CASE para Constantes (Valores Imutáveis):**
```typescript
const MAX_TENTATIVAS: number = 3;
const API_BASE_URL: string = 'https://api.exemplo.com';
const TIMEOUT_SEGUNDOS: number = 30;
```

**Conceito:** Convenção comunica intenção - camelCase para dados mutáveis, UPPER_SNAKE_CASE para configurações fixas.

#### Funções e Métodos

**camelCase:**
```typescript
function calcularTotal(preco: number, quantidade: number): number {
  return preco * quantidade;
}

function validarEmail(email: string): boolean {
  return email.includes('@');
}
```

**Conceito:** Funções são "ações", camelCase sugere verbos ou frases verbais.

#### Classes, Interfaces e Types

**PascalCase:**
```typescript
class Usuario {
  nome: string;
  email: string;
}

interface ConfiguracaoApp {
  porta: number;
  host: string;
}

type ResultadoAPI = {
  sucesso: boolean;
  dados: any;
};
```

**Conceito:** Classes e tipos são "substantivos" - entidades. PascalCase distingue visualmente de variáveis.

#### Genéricos

**Letra Única Maiúscula ou PascalCase:**
```typescript
// Convenção tradicional - letra única
function primeiro<T>(array: T[]): T {
  return array[0];
}

// Descritivo - PascalCase
function mapear<TEntrada, TSaida>(
  item: TEntrada,
  transformar: (x: TEntrada) => TSaida
): TSaida {
  return transformar(item);
}
```

**Conceito:** `T` maiúsculo comunica "tipo genérico" por convenção universal.

### Casos Problemáticos e Armadilhas

#### Armadilha 1: Confusão entre Tipo e Valor

```typescript
// Tipo (PascalCase)
interface Usuario {
  nome: string;
}

// Variável com nome similar (camelCase)
let usuario: Usuario = { nome: 'Ana' };

// Erro comum - trocar capitalização
let novoUsuario: usuario = { nome: 'Beto' }; // Erro - 'usuario' não é tipo
```

**Conceito:** TypeScript distingue namespaces de tipo e valor, mas ambos respeitam capitalização.

#### Armadilha 2: Sistema de Arquivos Case-Insensitive

**Problema no Windows:**
```typescript
// usuario.ts
export class Usuario { }

// Importação com capitalização errada
import { Usuario } from './Usuario'; // Windows encontra arquivo
// Mas pode causar problemas em Linux/CI pipeline!
```

**Solução:** Sempre corresponder capitalização exata em imports:
```typescript
import { Usuario } from './usuario'; // Corresponde nome de arquivo exato
```

**Configuração ESLint:**
```json
{
  "rules": {
    "import/no-unresolved": ["error", { "caseSensitive": true }]
  }
}
```

#### Armadilha 3: Propriedades de Objetos Similares

```typescript
const api = {
  url: 'http://api.exemplo.com',
  URL: 'http://backup.exemplo.com', // Propriedade diferente!
  Url: 'http://terceiro.exemplo.com' // Mais uma!
};

// Confusão ao acessar
console.log(api.url); // Qual você quis?
console.log(api.URL);
console.log(api.Url);
```

**Solução:** Evitar propriedades que diferem apenas em capitalização. Use nomes descritivos:
```typescript
const api = {
  urlPrimaria: 'http://api.exemplo.com',
  urlBackup: 'http://backup.exemplo.com'
};
```

#### Armadilha 4: Palavras-Chave Capitalizadas

```typescript
// Erro comum - capitalizar palavra-chave
Function teste() { } // SyntaxError - 'Function' não é válido
Class MinhaClasse { } // SyntaxError - 'Class' não é válido

// Correto
function teste() { }
class MinhaClasse { }
```

**Conceito:** Palavras-chave devem ser sempre minúsculas.

### Convenções de Nomenclatura Detalhadas

#### camelCase - Variáveis e Funções

**Regra:** Primeira palavra minúscula, palavras subsequentes capitalizadas.

```typescript
// Variáveis
let nomeUsuario = 'Ana';
let idadeEmAnos = 30;
let enderecoCompleto = 'Rua Principal, 123';

// Funções
function calcularIdade() { }
function buscarUsuarioPorId() { }
function validarEntrada() { }
```

**Quando Usar:**
- Variáveis locais e globais
- Parâmetros de função
- Propriedades de objeto (geralmente)
- Métodos de classe (verbos)

#### PascalCase - Classes, Interfaces, Types

**Regra:** Todas as palavras capitalizadas, incluindo primeira.

```typescript
// Classes
class Usuario { }
class ConfiguracaoServidor { }
class GerenciadorDeSessao { }

// Interfaces
interface UsuarioDTO { }
interface RespostaAPI { }

// Types
type EventoCustomizado = { };
type FuncaoCallback = () => void;

// Enums
enum StatusPedido { }
enum TipoUsuario { }
```

**Quando Usar:**
- Classes
- Interfaces
- Type aliases
- Enums
- Componentes React (convenção específica)

#### UPPER_SNAKE_CASE - Constantes

**Regra:** Todas maiúsculas, palavras separadas por underscore.

```typescript
const MAX_TENTATIVAS = 3;
const API_BASE_URL = 'https://api.com';
const TIMEOUT_EM_SEGUNDOS = 30;
const VERSAO_API = 'v1';
```

**Quando Usar:**
- Valores verdadeiramente constantes (configurações, magic numbers)
- Não usar para objetos/arrays (mesmo se `const`)

```typescript
// Evitar para objetos
const CONFIG = { porta: 3000 }; // Evitar UPPER_SNAKE_CASE
const config = { porta: 3000 }; // Preferir camelCase
```

#### snake_case - Raramente em TypeScript

**Regra:** Todas minúsculas, palavras separadas por underscore.

```typescript
// Raramente usado em TypeScript moderno
let nome_completo = 'Ana'; // Não idiomático
```

**Quando Usar:**
- Geralmente evitado em TypeScript
- Pode aparecer em interop com Python, Ruby, SQL
- Propriedades de banco de dados mapeadas

#### Prefixos e Sufixos Especiais

**Interfaces - Sem Prefixo `I` (Moderno):**
```typescript
// Antigo (C#, Java influência)
interface IUsuario { }

// Moderno TypeScript
interface Usuario { } // Preferido
```

**Tipos Genéricos - Prefixo `T`:**
```typescript
// Opcional mas comum
type TUsuario = Usuario;

function processar<TEntrada, TSaida>(entrada: TEntrada): TSaida { }
```

**Privados - Sem Prefixo `_`:**
```typescript
class Usuario {
  // Antigo
  private _nome: string;

  // Moderno - usar 'private' keyword
  private nome: string;
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Seguir Convenções Rigorosamente

**Contexto:** Projetos profissionais, equipes grandes, código compartilhado.

**Raciocínio:**
- Consistência facilita leitura
- Convenções comunicam tipo/propósito
- Onboarding mais rápido (padrões conhecidos)

**Enforçar com Linter:**
```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "class",
        "format": ["PascalCase"]
      },
      {
        "selector": "interface",
        "format": ["PascalCase"]
      },
      {
        "selector": "typeAlias",
        "format": ["PascalCase"]
      }
    ]
  }
}
```

### Quando Permitir Exceções

**Contexto:** Interoperabilidade com APIs externas, dados de banco, JSON.

**Exemplos:**

**API REST com snake_case:**
```typescript
// DTO espelha formato JSON de API
interface UsuarioAPI {
  user_id: number; // snake_case da API
  full_name: string;
  email_address: string;
}

// Converter para convenção TypeScript
interface Usuario {
  userId: number;
  fullName: string;
  emailAddress: string;
}
```

**Banco de Dados:**
```typescript
// Colunas de banco em snake_case
interface TabelaUsuarios {
  user_id: number;
  created_at: Date;
}
```

### Quando Evitar Identificadores Similares

**Contexto:** Sempre - evite confusão.

**Problema:**
```typescript
// Confuso - diferem apenas em capitalização
let usuario = 'Ana';
let Usuario = 'Beto';
let USUARIO = 'Carlos';

// Qual usar? Difícil lembrar
console.log(usuario);
```

**Solução:** Use nomes descritivos diferentes:
```typescript
let nomeUsuarioAtual = 'Ana';
class Usuario { }
const USUARIO_PADRAO = 'Convidado';
```

---

## ⚠️ Limitações e Considerações Teóricas

### Limitação: Erro Humano com Capitalização

**Problema:** Desenvolvedores podem digitar capitalização errada, causando erros:

```typescript
let nomeCompleto = 'Ana';
console.log(nomecompleto); // ReferenceError - erro de digitação
```

**Mitigação:**
- IDEs com autocomplete (VS Code)
- ESLint detecta variáveis não definidas
- TypeScript compiler verifica em tempo de compilação

### Limitação: Incompatibilidade de Sistema de Arquivos

**Problema:** Código funciona em Windows (case-insensitive) mas quebra em Linux (case-sensitive):

```typescript
// Windows: Usuario.ts e usuario.ts são MESMO arquivo
// Linux: Usuario.ts e usuario.ts são arquivos DIFERENTES

import { Usuario } from './usuario'; // Windows OK, Linux pode errar
```

**Mitigação:**
- Sempre corresponder capitalização exata em imports
- CI/CD em Linux para detectar problemas antes de deploy
- ESLint rule `import/no-unresolved` com `caseSensitive: true`

### Consideração: Colisão com Bibliotecas Externas

**Problema:** Bibliotecas podem usar convenções diferentes:

```typescript
// Biblioteca usa PascalCase para funções (incomum)
import { ProcessarDados } from 'biblioteca-externa';

// Pode confundir com classe
```

**Mitigação:**
- Renomear na importação para convenção local
```typescript
import { ProcessarDados as processarDados } from 'biblioteca-externa';
```

### Consideração: Tipos Built-in - `string` vs `String`

**Armadilha:** TypeScript tem tipos primitivos (minúsculos) e wrapper objects (PascalCase):

```typescript
// Tipo primitivo (preferir)
let nome: string = 'Ana';

// Wrapper object (evitar)
let nomeObj: String = new String('Ana');

// São diferentes!
let x: string = new String('teste'); // Erro de tipo
```

**Regra:** Sempre use tipos primitivos minúsculos (`string`, `number`, `boolean`), não wrappers (`String`, `Number`, `Boolean`).

---

## 🔗 Interconexões Conceituais

### Relação com ESLint e Linters

Linters podem enforçar convenções de nomenclatura:

```json
{
  "rules": {
    "@typescript-eslint/naming-convention": ["error", {
      "selector": "default",
      "format": ["camelCase"],
      "leadingUnderscore": "forbid",
      "trailingUnderscore": "forbid"
    }]
  }
}
```

Erros de capitalização são detectados durante desenvolvimento.

### Relação com IDEs (IntelliSense)

IDEs modernos (VS Code) oferecem autocomplete case-sensitive:

```typescript
let nomeCompleto = 'Ana';
// Digitar "nome" + Ctrl+Space
// IDE sugere "nomeCompleto" com capitalização exata
```

Reduz erros de capitalização.

### Relação com TypeScript Compiler

Compilador verifica capitalização em tempo de compilação:

```typescript
let usuario = 'Ana';
console.log(Usuario); // Erro TS2304: Cannot find name 'Usuario'
```

Erros são detectados antes de execução.

### Relação com Sistemas de Controle de Versão

Git em sistemas case-insensitive pode ter problemas:

```bash
# Renomear arquivo mudando apenas capitalização
git mv usuario.ts Usuario.ts

# Em Windows, pode não detectar mudança
# Solução: forçar
git mv usuario.ts temp.ts
git mv temp.ts Usuario.ts
```

---

## 🚀 Evolução e Próximos Conceitos

### Fundação para Convenções de Código

Dominar case sensitivity é base para:
- Seguir guias de estilo (Airbnb, Google)
- Escrever código idiomático
- Colaborar em projetos profissionais

### Base para Sistema de Tipos

Entender case sensitivity facilita:
- Distinguir tipos de valores
- Usar namespaces de tipo/valor efetivamente
- Evitar conflitos de nomenclatura

### Preparação para Ferramentas Avançadas

Compreender capitalização habilita uso de:
- Linters com regras de nomenclatura
- Geradores de código (scaffolding)
- Refatoração automática

### Caminho para Código Profissional

A jornada com case sensitivity evolui:
1. **Aprender Regras** → camelCase, PascalCase, etc.
2. **Aplicar Convenções** → Código consistente
3. **Automatizar** → ESLint enforça regras
4. **Internalizar** → Convenções tornam-se segunda natureza

Case sensitivity, embora pareça detalhe sintático, é fundação para código TypeScript legível, manutenível e idiomático. Convenções baseadas em capitalização comunicam tipo e propósito de identificadores, transformando código em documentação autoexplicativa.
