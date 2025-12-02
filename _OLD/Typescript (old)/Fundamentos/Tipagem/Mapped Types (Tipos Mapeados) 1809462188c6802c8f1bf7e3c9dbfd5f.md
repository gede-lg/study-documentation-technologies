# Mapped Types (Tipos Mapeados)

## 1. Introdução

Os **Mapped Types** ou **Tipos Mapeados** são uma funcionalidade avançada do TypeScript que permite transformar tipos de forma programática. Eles facilitam a criação de novos tipos com base em tipos existentes, aplicando modificadores ou selecionando subconjuntos de propriedades. Os tipos mapeados como `Readonly`, `Partial`, `Pick`, `Record` e `Omit` são amplamente utilizados para manipular e adaptar tipos conforme as necessidades do desenvolvimento. Além disso, TypeScript permite a criação de tipos mapeados personalizados, oferecendo uma grande flexibilidade e reutilização de código. Dominar os tipos mapeados é essencial para escrever código TypeScript mais eficiente, seguro e fácil de manter.

## 2. Sumário

1. [Introdução](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#1-introdu%C3%A7%C3%A3o)
2. [Sumário](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#2-sum%C3%A1rio)
3. [Conteúdo Detalhado](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#3-conte%C3%BAdo-detalhado)
    - [Definição e Conceitos Fundamentais](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#defini%C3%A7%C3%A3o-e-conceitos-fundamentais)
    - [Sintaxe e Estrutura](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#sintaxe-e-estrutura)
    - [Componentes Principais](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#componentes-principais)
    - [Uso Avançado](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#uso-avan%C3%A7ado)
4. [Exemplos de Código Otimizados](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#4-exemplos-de-c%C3%B3digo-otimizados)
    - [`Readonly`](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#readonly)
    - [`Partial`](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#partial)
    - [`Pick`](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#pick)
    - [`Record`](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#record)
    - [`Omit`](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#omit)
    - [Criação de Tipos Personalizados com Mapped Types](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#cria%C3%A7%C3%A3o-de-tipos-personalizados-com-mapped-types)
5. [Informações Adicionais](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#5-informa%C3%A7%C3%B5es-adicionais)
6. [Referências para Estudo Independente](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#6-refer%C3%AAncias-para-estudo-independente)
7. [Formatação em Markdown](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#7-formata%C3%A7%C3%A3o-em-markdown)
8. [Conclusão](https://chatgpt.com/c/678d6091-dd58-8003-9b75-fa42bf893843#8-conclus%C3%A3o)

## 3. Conteúdo Detalhado

### Definição e Conceitos Fundamentais

**Tema Principal:** Mapped Types (Tipos Mapeados) em TypeScript

**Subtemas:**

- Tipos Mapeados Integrados:
    - `Readonly`
    - `Partial`
    - `Pick`
    - `Record`
    - `Omit`
- Criação de Tipos Mapeados Personalizados

**Conceitos Básicos vs. Avançados:**

- **Básicos:** Entendimento dos tipos mapeados padrão (`Readonly`, `Partial`, `Pick`, `Record`, `Omit`), suas definições e usos comuns.
- **Avançados:** Criação e utilização de tipos mapeados personalizados, combinação de tipos mapeados com generics e tipos condicionais, e aplicação em cenários complexos de tipagem.

### Sintaxe e Estrutura

**Tipos Mapeados Integrados:**
Cada tipo mapeado possui uma sintaxe específica que define como ele transforma um tipo base.

- **`Readonly`:** Transforma todas as propriedades de um tipo em somente leitura.
    
    ```tsx
    interface Pessoa {
        nome: string;
        idade: number;
    }
    
    type PessoaReadonly = Readonly<Pessoa>;
    
    ```
    
- **`Partial`:** Torna todas as propriedades de um tipo opcionais.
    
    ```tsx
    interface Configuracao {
        url: string;
        timeout: number;
    }
    
    type ConfiguracaoParcial = Partial<Configuracao>;
    
    ```
    
- **`Pick`:** Seleciona um subconjunto de propriedades de um tipo.
    
    ```tsx
    interface Produto {
        id: number;
        nome: string;
        preco: number;
        descricao: string;
    }
    
    type ProdutoBasico = Pick<Produto, "id" | "nome">;
    
    ```
    
- **`Record`:** Cria um tipo cujas propriedades são determinadas pelas chaves fornecidas e os valores são de um tipo específico.
    
    ```tsx
    type Status = "ativo" | "inativo" | "pendente";
    
    type MapaStatus = Record<Status, string>;
    
    ```
    
- **`Omit`:** Remove um conjunto de propriedades de um tipo.
    
    ```tsx
    interface Usuario {
        id: number;
        nome: string;
        senha: string;
    }
    
    type UsuarioSemSenha = Omit<Usuario, "senha">;
    
    ```
    

**Criação de Tipos Mapeados Personalizados:**
Permite definir transformações específicas em tipos base utilizando a sintaxe de tipos mapeados.

```tsx
type MeuMappedType<T> = {
    [P in keyof T]: T[P];
};

```

### Componentes Principais

### `Readonly`

- **Descrição:** Transforma todas as propriedades de um tipo em somente leitura (`readonly`), impedindo que sejam modificadas após a inicialização.
- **Uso Comum:** Garantir a imutabilidade de objetos, prevenindo alterações acidentais.
- **Interação:** Pode ser combinado com outros tipos mapeados para criar tipos mais restritivos.

### `Partial`

- **Descrição:** Torna todas as propriedades de um tipo opcionais (`?`), permitindo a criação de objetos com apenas algumas das propriedades definidas.
- **Uso Comum:** Facilitar atualizações parciais de objetos ou criação de objetos incompletos.
- **Interação:** Útil em cenários onde a criação completa de um objeto não é necessária ou possível.

### `Pick`

- **Descrição:** Seleciona um subconjunto específico de propriedades de um tipo para criar um novo tipo.
- **Uso Comum:** Criar tipos especializados a partir de tipos mais gerais, focando apenas nas propriedades necessárias.
- **Interação:** Pode ser usado para criar interfaces para APIs ou componentes que requerem apenas algumas propriedades de um objeto.

### `Record`

- **Descrição:** Cria um tipo cujas chaves são especificadas e os valores são de um tipo determinado.
- **Uso Comum:** Modelar dicionários, mapeamentos ou tabelas de lookup onde as chaves são conhecidas e os valores seguem um padrão específico.
- **Interação:** Pode ser combinado com enums ou tipos de união para definir conjuntos fixos de chaves.

### `Omit`

- **Descrição:** Remove um conjunto de propriedades de um tipo, criando um novo tipo sem essas propriedades.
- **Uso Comum:** Excluir propriedades sensíveis ou desnecessárias de um tipo, como remover campos de senha de um tipo de usuário.
- **Interação:** Similar ao `Pick`, mas ao invés de selecionar propriedades, remove-as.

### Uso Avançado

- **Combinação de Tipos Mapeados:** Utilizar múltiplos tipos mapeados em conjunto para criar transformações mais complexas.
    
    ```tsx
    type ConfiguracaoCompleta = Readonly<Partial<Configuracao>>;
    
    ```
    
- **Tipos Mapeados com Generics:** Criar tipos mapeados que aceitam parâmetros genéricos para maior flexibilidade e reusabilidade.
    
    ```tsx
    type MinhaPartial<T> = {
        [P in keyof T]?: T[P];
    };
    
    ```
    
- **Tipos Condicionais com Tipos Mapeados:** Integrar tipos condicionais para criar tipos dinâmicos baseados em condições específicas.
    
    ```tsx
    type ExcluirPropriedades<T, K extends keyof T> = {
        [P in keyof T as P extends K ? never : P]: T[P];
    };
    
    ```
    
- **Criação de Tipos Mapeados Personalizados:** Definir transformações específicas que não são cobertas pelos tipos mapeados integrados.
    
    ```tsx
    type PropriedadesOpcionalmenteReadonly<T> = {
        readonly [P in keyof T as P extends "id" ? P : never]: T[P];
    } & {
        [P in keyof T as P extends "id" ? never : P]: T[P];
    };
    
    ```
    

## 4. Exemplos de Código Otimizados

### `Readonly`

```tsx
interface Produto {
    id: number;
    nome: string;
    preco: number;
}

type ProdutoReadonly = Readonly<Produto>;

const produto: ProdutoReadonly = {
    id: 1,
    nome: "Laptop",
    preco: 2500,
};

// produto.preco = 3000; // Erro: Cannot assign to 'preco' because it is a read-only property.

```

### `Partial`

```tsx
interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
}

type UsuarioParcial = Partial<Usuario>;

const atualizacaoUsuario: UsuarioParcial = {
    email: "novoemail@example.com",
    // senha: "novaSenha123" // Opcional, pode ser incluída ou não
};

```

### `Pick`

```tsx
interface Pedido {
    id: number;
    data: Date;
    cliente: string;
    valorTotal: number;
    status: string;
}

type PedidoBasico = Pick<Pedido, "id" | "cliente" | "valorTotal">;

const pedido: PedidoBasico = {
    id: 101,
    cliente: "João Silva",
    valorTotal: 500,
    // data: new Date(), // Erro: 'data' não existe em 'PedidoBasico'.
    // status: "Em andamento" // Erro: 'status' não existe em 'PedidoBasico'.
};

```

### `Record`

```tsx
type Cores = "vermelho" | "verde" | "azul";

type MapaHexadecimal = Record<Cores, string>;

const coresHex: MapaHexadecimal = {
    vermelho: "#FF0000",
    verde: "#00FF00",
    azul: "#0000FF",
    // amarelo: "#FFFF00" // Erro: Object literal may only specify known properties, and 'amarelo' does not exist in type 'MapaHexadecimal'.
};

```

### `Omit`

```tsx
interface Conta {
    id: number;
    nome: string;
    saldo: number;
    senha: string;
}

type ContaPublica = Omit<Conta, "senha">;

const conta: ContaPublica = {
    id: 1,
    nome: "Maria",
    saldo: 1000,
    // senha: "senha123" // Erro: 'senha' não existe em 'ContaPublica'.
};

```

### Criação de Tipos Personalizados com Mapped Types

```tsx
// Tipo mapeado personalizado que torna todas as propriedades opcionais e readonly
type OpcionalReadonly<T> = {
    readonly [P in keyof T]?: T[P];
};

interface Configuracao {
    apiUrl: string;
    timeout: number;
    debug: boolean;
}

type ConfiguracaoOpcionalReadonly = OpcionalReadonly<Configuracao>;

const config: ConfiguracaoOpcionalReadonly = {
    apiUrl: "https://api.exemplo.com",
    // timeout: 5000, // Opcional
    // debug: true, // Opcional
};

// config.apiUrl = "https://novaapi.com"; // Erro: Cannot assign to 'apiUrl' because it is a read-only property.

```

## 5. Informações Adicionais

- **Diferença entre `Pick` e `Omit`:**
    - **`Pick`:** Seleciona um conjunto específico de propriedades de um tipo.
    - **`Omit`:** Remove um conjunto específico de propriedades de um tipo.
- **Tipos Mapeados vs. Interfaces:**
    - **Tipos Mapeados:** Permitem transformações dinâmicas e programáticas de tipos.
    - **Interfaces:** Focadas na definição da estrutura de objetos, podendo ser estendidas e implementadas.
- **Melhores Práticas:**
    - **Reutilização de Tipos:** Utilize tipos mapeados para evitar repetição de código e promover a reutilização.
    - **Nomenclatura Clara:** Nomeie os tipos mapeados de forma descritiva para facilitar a compreensão do código.
    - **Evitar Excesso de Complexidade:** Use tipos mapeados personalizados com cautela para não tornar o código difícil de entender.
- **Limitações dos Tipos Mapeados:**
    - **Propriedades Computadas:** Embora poderosos, tipos mapeados não suportam todas as operações de transformação desejadas e podem ter limitações em cenários muito específicos.
- **Integração com Outros Recursos do TypeScript:**
    - **Generics:** Combine tipos mapeados com generics para criar tipos altamente flexíveis e reutilizáveis.
    - **Tipos Condicionais:** Utilize tipos mapeados com tipos condicionais para criar lógicas de tipagem mais sofisticadas.
- **Performance de Compilação:**
    - Uso excessivo de tipos mapeados complexos pode afetar a performance da compilação. É importante balancear a expressividade com a simplicidade.

## 6. Referências para Estudo Independente

- [Documentação Oficial do TypeScript - Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Documentação Oficial do TypeScript - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript Deep Dive - Mapped Types](https://basarat.gitbook.io/typescript/type-system/mapped-types)
- [Artigo: Understanding Mapped Types in TypeScript](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types)
- [Livro: Programming TypeScript](https://www.oreilly.com/library/view/programming-typescript/9781492037644/)
- [Curso: Advanced TypeScript no Udemy](https://www.udemy.com/course/advanced-typescript/)
- [GitHub Repository - TypeScript Samples](https://github.com/microsoft/TypeScriptSamples)

## 7. Formatação em Markdown

Este documento está organizado utilizando a sintaxe Markdown, com cabeçalhos (`#`, `##`, `###`) para estruturar as seções, listas ordenadas e não ordenadas para itens detalhados, e trechos de código formatados com blocos de código `typescript`  para melhor legibilidade e compreensão dos exemplos apresentados.

## 8. Conclusão

Os **Mapped Types** em TypeScript são ferramentas essenciais para transformar e adaptar tipos de forma programática, aumentando significativamente a flexibilidade e a reutilização de tipos no desenvolvimento de aplicações. Os tipos mapeados integrados como `Readonly`, `Partial`, `Pick`, `Record` e `Omit` fornecem funcionalidades prontas para uso que atendem a diversas necessidades comuns, desde a imutabilidade de objetos até a seleção e exclusão de propriedades específicas.

Além disso, a capacidade de criar tipos mapeados personalizados permite que os desenvolvedores definam transformações de tipos adaptadas às particularidades de seus projetos, promovendo código mais limpo, seguro e fácil de manter. A combinação de tipos mapeados com outras funcionalidades avançadas do TypeScript, como generics e tipos condicionais, potencializa ainda mais a expressividade e a robustez da tipagem estática.

Dominar os tipos mapeados não apenas melhora a segurança e a consistência do código, mas também facilita a escalabilidade e a manutenção de aplicações complexas. Em um cenário de desenvolvimento moderno, onde a tipagem forte e a reutilização de código são cruciais, os **Mapped Types** destacam-se como uma prática indispensável para o sucesso e a qualidade das aplicações desenvolvidas com TypeScript.