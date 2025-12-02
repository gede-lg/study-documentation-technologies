# Recursão em Tipos Genéricos

Este documento apresenta uma explicação detalhada sobre recursão em tipos genéricos no TypeScript, com ênfase em construções avançadas como *deep partial*, *deep readonly* e outras técnicas similares. Abordaremos os conceitos fundamentais, a sintaxe, exemplos de código e casos de uso práticos.

---

## Sumário

1. [Introdução](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#introdu%C3%A7%C3%A3o)
2. [Definição e Conceitos Fundamentais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#defini%C3%A7%C3%A3o-e-conceitos-fundamentais)
    - [Tipos Genéricos](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#tipos-gen%C3%A9ricos)
    - [Recursão em Tipos](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#recurs%C3%A3o-em-tipos)
3. [Sintaxe e Estrutura](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#sintaxe-e-estrutura)
    - [Declaração de Tipos Genéricos Recursivos](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#declara%C3%A7%C3%A3o-de-tipos-gen%C3%A9ricos-recursivos)
4. [Componentes Principais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#componentes-principais)
    - [Deep Partial](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#deep-partial)
    - [Deep Readonly](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#deep-readonly)
    - [Outras Construções Recursivas](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#outras-constru%C3%A7%C3%B5es-recursivas)
5. [Uso Avançado e Casos Reais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#uso-avan%C3%A7ado-e-casos-reais)
6. [Exemplos de Código Otimizados](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#exemplos-de-c%C3%B3digo-otimizados)
7. [Informações Adicionais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#informa%C3%A7%C3%B5es-adicionais)
8. [Referências para Estudo Independente](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#refer%C3%AAncias-para-estudo-independente)

---

## Introdução

A **recursão em tipos genéricos** no TypeScript permite a criação de tipos que se referenciam de maneira recursiva, possibilitando a manipulação de estruturas de dados aninhadas de forma segura e tipada. Essa abordagem é especialmente útil para aplicar transformações em profundidade (deep transformations) como tornar todas as propriedades de um objeto opcionais (*deep partial*) ou somente leitura (*deep readonly*). Com a evolução do TypeScript, essas técnicas se tornaram essenciais para garantir a integridade dos dados e evitar erros em aplicações complexas.

---

## Definição e Conceitos Fundamentais

### Tipos Genéricos

- **Conceito:**
    
    Tipos genéricos permitem definir funções, classes ou interfaces que operam sobre diversos tipos de dados sem especificar explicitamente o tipo utilizado. Eles fornecem flexibilidade e reusabilidade, mantendo a segurança de tipos.
    
- **Exemplo Básico:**
    
    ```tsx
    function identity<T>(arg: T): T {
      return arg;
    }
    
    const numberValue = identity(123); // T é inferido como number
    const stringValue = identity("Olá"); // T é inferido como string
    
    ```
    

### Recursão em Tipos

- **Conceito:**
    
    A recursão em tipos ocorre quando um tipo se refere a si próprio, direta ou indiretamente, permitindo a definição de estruturas aninhadas, como árvores, objetos aninhados e estruturas de dados complexas.
    
- **Aplicação Prática:**
    
    Esse conceito é essencial para criar utilitários que percorrem e transformam propriedades de um objeto de forma recursiva, garantindo que as transformações sejam aplicadas em todos os níveis de profundidade.
    

---

## Sintaxe e Estrutura

### Declaração de Tipos Genéricos Recursivos

Em TypeScript, um tipo recursivo pode ser definido usando condicionais de tipo (`conditional types`) e mapeamento de tipos (`mapped types`). Isso permite iterar sobre as propriedades de um objeto e aplicar transformações recursivamente.

- **Exemplo de Estrutura Genérica Recursiva:**
    
    ```tsx
    type DeepTransform<T> = {
      [K in keyof T]: T[K] extends object ? DeepTransform<T[K]> : T[K];
    };
    
    ```
    

Nesse exemplo, se `T[K]` for um objeto, a transformação `DeepTransform` é aplicada recursivamente. Caso contrário, o tipo original é mantido.

---

## Componentes Principais

### Deep Partial

- **Definição:**
    
    Converte todas as propriedades de um objeto para opcionais, aplicando a transformação recursivamente em estruturas aninhadas.
    
- **Implementação:**
    
    ```tsx
    type DeepPartial<T> = {
      [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
    };
    
    ```
    
- **Exemplo de Uso:**
    
    ```tsx
    interface User {
      name: string;
      address: {
        street: string;
        city: string;
      };
    }
    
    // Utilizando DeepPartial para tornar todas as propriedades opcionais recursivamente
    const partialUser: DeepPartial<User> = {
      name: "Alice",
      address: {
        city: "Wonderland"
        // 'street' pode estar ausente
      }
    };
    
    ```
    

### Deep Readonly

- **Definição:**
    
    Converte todas as propriedades de um objeto para somente leitura, incluindo propriedades aninhadas.
    
- **Implementação:**
    
    ```tsx
    type DeepReadonly<T> = {
      readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
    };
    
    ```
    
- **Exemplo de Uso:**
    
    ```tsx
    interface Config {
      apiUrl: string;
      options: {
        retry: number;
        timeout: number;
      };
    }
    
    const config: DeepReadonly<Config> = {
      apiUrl: "https://api.example.com",
      options: {
        retry: 3,
        timeout: 5000
      }
    };
    
    // Tentativa de modificação gerará erro de compilação
    // config.apiUrl = "https://api.changed.com"; // Error!
    // config.options.timeout = 6000; // Error!
    
    ```
    

### Outras Construções Recursivas

Além dos exemplos acima, a recursão em tipos genéricos pode ser aplicada em outros contextos, como:

- **Deep Non-Nullable:** Remove `null` e `undefined` de todas as propriedades recursivamente.
    
    ```tsx
    type DeepNonNullable<T> = {
      [K in keyof T]-?: T[K] extends object ? DeepNonNullable<T[K]> : NonNullable<T[K]>;
    };
    
    ```
    
- **Deep Pick:** Seleciona apenas determinadas propriedades de um objeto de forma recursiva.
    
    ```tsx
    type DeepPick<T, U> = {
      [K in keyof T & keyof U]: T[K] extends object ? DeepPick<T[K], U[K]> : T[K];
    };
    
    ```
    
    *Nota:* Implementações de *Deep Pick* podem variar de acordo com as necessidades específicas do projeto e a estrutura dos tipos envolvidos.
    

---

## Uso Avançado e Casos Reais

A recursão em tipos genéricos é especialmente útil em projetos com estruturas de dados complexas, onde os objetos possuem níveis aninhados profundos. Exemplos de casos reais incluem:

- **Validação de Formulários:**
    
    Aplicar validações em cada nível de um formulário complexo.
    
- **Configurações de Aplicação:**
    
    Garantir que todas as propriedades de uma configuração de sistema sejam somente leitura ou opcionais de forma recursiva.
    
- **Manipulação de Dados em APIs:**
    
    Transformar ou limpar dados recebidos de uma API onde as respostas podem conter objetos aninhados complexos.
    

---

## Exemplos de Código Otimizados

### Exemplo Completo: Deep Partial

```tsx
/**
 * DeepPartial torna todas as propriedades de um objeto opcional, recursivamente.
 */
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface Product {
  id: number;
  name: string;
  details: {
    description: string;
    specifications: {
      weight: number;
      dimensions: {
        width: number;
        height: number;
      };
    };
  };
}

// Exemplo de uso: criação de um produto com propriedades opcionais em profundidade
const partialProduct: DeepPartial<Product> = {
  name: "Notebook",
  details: {
    specifications: {
      dimensions: {
        width: 30
        // 'height' pode estar ausente
      }
    }
  }
};

```

### Exemplo Completo: Deep Readonly

```tsx
/**
 * DeepReadonly torna todas as propriedades de um objeto somente leitura, recursivamente.
 */
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface Settings {
  theme: string;
  layout: {
    header: boolean;
    sidebar: boolean;
  };
}

const appSettings: DeepReadonly<Settings> = {
  theme: "dark",
  layout: {
    header: true,
    sidebar: false
  }
};

// Tentativa de modificação gerará erro de compilação:
// appSettings.theme = "light"; // Error!
// appSettings.layout.header = false; // Error!

```

### Exemplo Completo: Deep Non-Nullable

```tsx
/**
 * DeepNonNullable remove null e undefined de todas as propriedades, recursivamente.
 */
type DeepNonNullable<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepNonNullable<T[K]> : NonNullable<T[K]>;
};

interface ResponseData {
  data?: {
    user?: {
      id?: number | null;
      name?: string | null;
    } | null;
  } | null;
}

const validResponse: DeepNonNullable<ResponseData> = {
  data: {
    user: {
      id: 1,
      name: "Bob"
    }
  }
};

```

---

## Informações Adicionais

- **Limitações:**
    - Recursão em tipos pode causar problemas de desempenho na verificação de tipos se aplicada em estruturas muito grandes ou complexas.
    - É importante evitar recursões infinitas ou excessivas que podem levar a erros de compilação ou limites internos do compilador TypeScript.
- **Melhores Práticas:**
    - Teste as transformações de tipos com exemplos reais.
    - Utilize comentários e documentação para manter a clareza do que cada utilitário faz.
    - Verifique as versões do TypeScript, pois melhorias e mudanças podem afetar a forma como tipos recursivos são interpretados.
- **Ferramentas e Suporte:**
    - **TypeScript Playground:** Uma excelente ferramenta para testar e experimentar com tipos genéricos recursivos.
    - **ESLint e TSLint:** Utilitários que ajudam a manter a consistência e qualidade do código.

---

## Referências para Estudo Independente

1. **Documentação Oficial do TypeScript:**
    
    [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/advanced/types.html) – Um recurso completo para entender tipos avançados.
    
2. **Artigos e Tutoriais:**
    - [Understanding Advanced Types in TypeScript](https://www.typescriptlang.org/docs/handbook/advanced-types.html) – Guia oficial do TypeScript sobre tipos avançados.
    - [Recursive Types in TypeScript](https://blog.logrocket.com/recursive-types-in-typescript/) – Um artigo prático que explora exemplos e casos de uso.
3. **Livros:**
    - *"Programming TypeScript"* de Boris Cherny – Aborda conceitos avançados de tipos e como utilizá-los em projetos reais.
    - *"TypeScript Quickly"* – Um livro que cobre desde os fundamentos até conceitos avançados.
4. **Tutoriais em Vídeo:**
    - [YouTube - Advanced TypeScript Types](https://www.youtube.com/results?search_query=advanced+typescript+types) – Uma série de vídeos que demonstram a aplicação prática de tipos avançados em TypeScript.

---

Este documento fornece uma visão abrangente sobre a recursão em tipos genéricos no TypeScript, destacando sua utilidade em cenários avançados de desenvolvimento. Ao dominar essas técnicas, você será capaz de criar APIs e estruturas de dados mais robustas, seguras e eficientes.