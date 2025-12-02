# Template Literal Types

## 1. Introdução

Os **Template Literal Types** são uma funcionalidade avançada do TypeScript que permite a criação de tipos baseados em literais de strings dinâmicos. Inspirados nas template literals do JavaScript, esses tipos possibilitam a composição de strings a partir de partes fixas e dinâmicas, aumentando a expressividade e a flexibilidade da tipagem estática. Além disso, quando combinados com operadores como `keyof` e union types, os Template Literal Types permitem a construção de tipos altamente reutilizáveis e seguros, adequados para uma ampla variedade de cenários no desenvolvimento de aplicações complexas. Dominar os Template Literal Types é essencial para aproveitar ao máximo as capacidades de tipagem avançada oferecidas pelo TypeScript.

## 2. Sumário

1. [Introdução](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#1-introdu%C3%A7%C3%A3o)
2. [Sumário](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#2-sum%C3%A1rio)
3. [Conteúdo Detalhado](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#3-conte%C3%BAdo-detalhado)
    - [Definição e Conceitos Fundamentais](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#defini%C3%A7%C3%A3o-e-conceitos-fundamentais)
    - [Sintaxe e Estrutura](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#sintaxe-e-estrutura)
    - [Componentes Principais](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#componentes-principais)
    - [Uso Avançado](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#uso-avan%C3%A7ado)
4. [Exemplos de Código Otimizados](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#4-exemplos-de-c%C3%B3digo-otimizados)
    - [Tipos Baseados em Literais de Strings Dinâmicos](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#tipos-baseados-em-literais-de-strings-din%C3%A2micos)
    - [Combinação com `keyof` e Union Types](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#combina%C3%A7%C3%A3o-com-keyof-e-union-types)
5. [Informações Adicionais](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#5-informa%C3%A7%C3%B5es-adicionais)
6. [Referências para Estudo Independente](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#6-refer%C3%AAncias-para-estudo-independente)
7. [Formatação em Markdown](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#7-formata%C3%A7%C3%A3o-em-markdown)
8. [Conclusão](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#8-conclus%C3%A3o)

## 3. Conteúdo Detalhado

### Definição e Conceitos Fundamentais

**Tema Principal:** Template Literal Types em TypeScript

**Subtemas:**

- **Tipos Baseados em Literais de Strings Dinâmicos:** Criação de tipos utilizando combinações de strings fixas e variáveis.
- **Combinação com `keyof` e Union Types:** Utilização de Template Literal Types em conjunto com outros operadores de tipos para aumentar a flexibilidade e reutilização.

**Conceitos Básicos vs. Avançados:**

- **Básicos:** Entendimento da sintaxe e das capacidades básicas dos Template Literal Types, incluindo a criação de tipos simples.
- **Avançados:** Combinação de Template Literal Types com `keyof`, union types, generics, tipos condicionais e outros recursos avançados do TypeScript para construir tipos complexos e dinâmicos.

### Sintaxe e Estrutura

Os Template Literal Types utilizam a sintaxe de template literals do JavaScript, envolvendo expressões dentro de crases (```) e utilizando a notação `${}` para inserir expressões dinâmicas.

```tsx
type Status = "ativo" | "inativo" | "pendente";

// Exemplo de Template Literal Type simples
type MensagemStatus = `Status atual: ${Status}`;

```

### Componentes Principais

### Tipos Baseados em Literais de Strings Dinâmicos

- **Descrição:** Permitem a criação de novos tipos de string combinando literais fixos com variáveis ou tipos existentes.
- **Uso Comum:** Definição de rotas de URL, mensagens de status, identificadores únicos e outros padrões de strings que seguem uma estrutura específica.
- **Interação:** Podem ser combinados com union types para representar um conjunto finito de possibilidades dinâmicas.

### Combinação com `keyof` e Union Types

- **Descrição:** Integração de Template Literal Types com `keyof` para criar tipos que dependem das propriedades de objetos, e com union types para expandir as possibilidades de combinação.
- **Uso Comum:** Geração de tipos de mensagens dinâmicas baseadas nas chaves de interfaces, criação de rotas dinâmicas baseadas em propriedades de objetos, e outros cenários que requerem flexibilidade na definição de tipos de string.
- **Interação:** Utilização de `keyof` para extrair chaves de objetos e combinar com partes fixas de strings para criar tipos dinâmicos e seguros.

### Uso Avançado

- **Generics com Template Literal Types:** Criação de tipos genéricos que utilizam template literals para construir tipos dinâmicos baseados em parâmetros genéricos.
    
    ```tsx
    type Evento<T extends string> = `on${Capitalize<T>}`;
    
    type EventoClick = Evento<"click">; // "onClick"
    type EventoHover = Evento<"hover">; // "onHover"
    
    ```
    
- **Tipos Condicionais com Template Literal Types:** Utilização de tipos condicionais para refinar ou construir tipos dinâmicos baseados em condições específicas.
    
    ```tsx
    type PrefixoEvento<T extends string> = T extends `on${infer U}` ? U : never;
    
    type TipoEvento = PrefixoEvento<"onClick" | "onHover" | "submit">; // "Click" | "Hover" | never
    
    ```
    
- **Integração com `keyof` para Tipos Dinâmicos Baseados em Objetos:**
    
    ```tsx
    interface Usuario {
        nome: string;
        idade: number;
        email: string;
    }
    
    type EventoUsuario = `on${Capitalize<keyof Usuario>}`; // "onNome" | "onIdade" | "onEmail"
    
    ```
    
- **Criação de Tipos Mapeados Personalizados com Template Literal Types:**
    
    ```tsx
    type Handlers<T> = {
        [K in keyof T as `handle${Capitalize<string & K>}`]: (value: T[K]) => void;
    };
    
    interface Produto {
        nome: string;
        preco: number;
    }
    
    type ProdutoHandlers = Handlers<Produto>;
    /*
    {
        handleNome: (value: string) => void;
        handlePreco: (value: number) => void;
    }
    */
    
    ```
    

## 4. Exemplos de Código Otimizados

### Tipos Baseados em Literais de Strings Dinâmicos

```tsx
// Definição de Status utilizando union types
type Status = "ativo" | "inativo" | "pendente";

// Criação de um tipo de mensagem baseado em Template Literal Type
type MensagemStatus = `Status atual: ${Status}`;

// Uso do tipo MensagemStatus
const mensagem1: MensagemStatus = "Status atual: ativo"; // Válido
const mensagem2: MensagemStatus = "Status atual: inativo"; // Válido
// const mensagem3: MensagemStatus = "Status atual: bloqueado"; // Erro: Type '"Status atual: bloqueado"' is not assignable to type 'MensagemStatus'.

```

### Combinação com `keyof` e Union Types

```tsx
// Interface exemplo
interface Usuario {
    nome: string;
    idade: number;
    email: string;
}

// Extração das chaves da interface Usuario usando keyof
type ChavesUsuario = keyof Usuario; // "nome" | "idade" | "email"

// Criação de tipos de eventos baseados nas chaves da interface
type EventoUsuario = `on${Capitalize<ChavesUsuario>}`; // "onNome" | "onIdade" | "onEmail"

// Função que recebe um evento de Usuario
function registrarEvento(evento: EventoUsuario) {
    console.log(`Evento registrado: ${evento}`);
}

registrarEvento("onNome"); // Válido
registrarEvento("onIdade"); // Válido
registrarEvento("onEmail"); // Válido
// registrarEvento("onSenha"); // Erro: Argument of type '"onSenha"' is not assignable to parameter of type 'EventoUsuario'.

```

### Criação de Tipos Genéricos com Template Literal Types

```tsx
// Tipo genérico para eventos com prefixo 'on'
type EventoGenerico<T extends string> = `on${Capitalize<T>}`;

// Exemplos de uso
type EventoClick = EventoGenerico<"click">; // "onClick"
type EventoSubmit = EventoGenerico<"submit">; // "onSubmit"

// Função que recebe um evento genérico
function dispararEvento<T extends string>(evento: EventoGenerico<T>) {
    console.log(`Evento disparado: ${evento}`);
}

dispararEvento("onClick"); // Válido
dispararEvento("onSubmit"); // Válido
// dispararEvento("click"); // Erro: Argument of type '"click"' is not assignable to parameter of type 'EventoGenerico<"click">'.

```

### Tipos Condicionais com Template Literal Types

```tsx
// Tipo condicional para extrair parte do Template Literal Type
type ExtrairParte<T extends string> = T extends `on${infer U}` ? U : never;

// Exemplos de uso
type Parte1 = ExtrairParte<"onClick">; // "Click"
type Parte2 = ExtrairParte<"onHover">; // "Hover"
type Parte3 = ExtrairParte<"submit">; // never

```

### Tipos Mapeados Personalizados com Template Literal Types

```tsx
// Tipo mapeado personalizado que cria handlers baseados nas propriedades de um objeto
type Handlers<T> = {
    [K in keyof T as `handle${Capitalize<string & K>}`]: (value: T[K]) => void;
};

// Interface de exemplo
interface Produto {
    nome: string;
    preco: number;
    estoque: number;
}

// Criação de um tipo de handlers para Produto
type ProdutoHandlers = Handlers<Produto>;
/*
{
    handleNome: (value: string) => void;
    handlePreco: (value: number) => void;
    handleEstoque: (value: number) => void;
}
*/

// Implementação dos handlers
const handlers: ProdutoHandlers = {
    handleNome: (value) => {
        console.log(`Nome do produto atualizado para: ${value}`);
    },
    handlePreco: (value) => {
        console.log(`Preço do produto atualizado para: ${value}`);
    },
    handleEstoque: (value) => {
        console.log(`Estoque do produto atualizado para: ${value}`);
    },
};

handlers.handleNome("Notebook"); // Output: Nome do produto atualizado para: Notebook
handlers.handlePreco(2500);      // Output: Preço do produto atualizado para: 2500
handlers.handleEstoque(50);      // Output: Estoque do produto atualizado para: 50

```

## 5. Informações Adicionais

- **Diferença entre Template Literal Types e Regular Template Literals:**
    - **Template Literal Types:** São utilizados para definir tipos estáticos baseados em combinações de strings, permitindo a criação de tipos dinâmicos e reutilizáveis.
    - **Regular Template Literals:** São utilizados para criar strings dinâmicas em tempo de execução, combinando variáveis e expressões.
- **Limitações dos Template Literal Types:**
    - **Inferência Limitada:** Embora poderosos, Template Literal Types têm limitações na inferência de tipos complexos e podem não cobrir todos os cenários dinâmicos.
    - **Complexidade:** Tipos altamente dinâmicos podem se tornar difíceis de ler e manter, especialmente quando combinados com múltiplos operadores de tipos.
- **Boas Práticas:**
    - **Clareza e Simplicidade:** Utilize Template Literal Types de forma clara e mantenha a simplicidade para facilitar a compreensão e manutenção do código.
    - **Documentação:** Documente os tipos mapeados e Template Literal Types personalizados para garantir que outros desenvolvedores entendam sua finalidade e uso.
    - **Reutilização:** Crie tipos genéricos e reutilizáveis quando possível para evitar duplicação e promover a consistência.
- **Integração com Outros Recursos do TypeScript:**
    - **Generics:** Combine Template Literal Types com generics para criar tipos altamente flexíveis e reutilizáveis.
    - **Tipos Condicionais:** Utilize tipos condicionais para refinar ainda mais os tipos dinâmicos baseados em condições específicas.
    - **Mapped Types:** Integre Template Literal Types com Mapped Types para transformar tipos de forma programática.
- **Performance de Compilação:**
    - O uso extensivo de Template Literal Types, especialmente em combinações complexas, pode impactar a performance da compilação. É importante balancear a expressividade com a eficiência.

## 6. Referências para Estudo Independente

- [Documentação Oficial do TypeScript - Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [TypeScript Deep Dive - Template Literal Types](https://basarat.gitbook.io/typescript/type-system/template-literal-types)
- [Artigo: Understanding Template Literal Types in TypeScript](https://www.typescriptlang.org/docs/handbook/advanced-types.html#template-literal-types)
- [Livro: Programming TypeScript](https://www.oreilly.com/library/view/programming-typescript/9781492037644/)
- [Curso: Advanced TypeScript no Udemy](https://www.udemy.com/course/advanced-typescript/)
- [GitHub Repository - TypeScript Samples](https://github.com/microsoft/TypeScriptSamples)
- [Artigo: Mastering Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#examples)

## 7. Formatação em Markdown

Este documento está organizado utilizando a sintaxe Markdown, com cabeçalhos (`#`, `##`, `###`) para estruturar as seções, listas ordenadas e não ordenadas para itens detalhados, e trechos de código formatados com blocos de código `typescript` para melhor legibilidade e compreensão dos exemplos apresentados.

## 8. Conclusão

Os **Template Literal Types** são uma adição poderosa ao conjunto de ferramentas do TypeScript, permitindo a criação de tipos baseados em combinações dinâmicas de strings. Ao possibilitar a construção de tipos expressivos e reutilizáveis, esses tipos aumentam significativamente a flexibilidade e a segurança do código, especialmente quando combinados com operadores como `keyof` e union types. A capacidade de gerar tipos dinâmicos com base em estruturas existentes promove a consistência e a reutilização, essenciais para o desenvolvimento de aplicações complexas e escaláveis.

Além disso, a integração dos Template Literal Types com outros recursos avançados do TypeScript, como generics, tipos condicionais e mapped types, expande ainda mais as possibilidades de tipagem estática, permitindo a modelagem precisa de cenários complexos. Contudo, é importante utilizar esses tipos de forma equilibrada, mantendo a clareza e a simplicidade para garantir a manutenção e a legibilidade do código a longo prazo.

Dominar os Template Literal Types não apenas aprimora a qualidade e a robustez do código, mas também capacita os desenvolvedores a explorar todo o potencial da tipagem estática do TypeScript, resultando em aplicações mais seguras, eficientes e de fácil manutenção.