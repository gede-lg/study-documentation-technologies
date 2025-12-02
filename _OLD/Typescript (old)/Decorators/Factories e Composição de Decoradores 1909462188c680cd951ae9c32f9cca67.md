# Factories e Composição de Decoradores

## 1. Introdução

Decorators são uma funcionalidade poderosa e experimental do TypeScript que permite modificar o comportamento de classes, métodos, propriedades e parâmetros de maneira declarativa. Eles são amplamente utilizados para adicionar funcionalidades, metadados ou realizar injeção de dependências de forma elegante e reutilizável.

Neste conteúdo, exploraremos especificamente **Factories e Composição de Decoradores**. Abordaremos como criar decoradores dinâmicos e compostos, ou seja, como gerar decoradores parametrizados (factories) e como combiná-los para atingir funcionalidades mais complexas. Esses conceitos são fundamentais para desenvolvedores que desejam escrever código mais limpo, modular e altamente configurável.

## 2. Sumário

1. [Definição e Conceitos Fundamentais](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#defini%C3%A7%C3%A3o-e-conceitos-fundamentais)
    - [O que são Decorators?](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#o-que-s%C3%A3o-decorators)
    - [Decorator Factories](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#decorator-factories)
    - [Composição de Decoradores](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#composi%C3%A7%C3%A3o-de-decoradores)
2. [Sintaxe e Estrutura](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#sintaxe-e-estrutura)
    - [Uso Básico de Decorators](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#uso-b%C3%A1sico-de-decorators)
    - [Criação de Decorator Factories](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#cria%C3%A7%C3%A3o-de-decorator-factories)
3. [Componentes Principais](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#componentes-principais)
    - [Funções Decoradoras](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#fun%C3%A7%C3%B5es-decoradoras)
    - [Interação e Combinação de Decoradores](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#intera%C3%A7%C3%A3o-e-combina%C3%A7%C3%A3o-de-decoradores)
4. [Uso Avançado](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#uso-avan%C3%A7ado)
    - [Casos de Uso Reais e Complexos](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#casos-de-uso-reais-e-complexos)
5. [Exemplos de Código Otimizados](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#exemplos-de-c%C3%B3digo-otimizados)
6. [Informações Adicionais](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#informa%C3%A7%C3%B5es-adicionais)
7. [Referências para Estudo Independente](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#refer%C3%AAncias-para-estudo-independente)

## 3. Conteúdo Detalhado

### Definição e Conceitos Fundamentais

### O que são Decorators?

Decorators são funções que podem ser aplicadas a classes, métodos, propriedades ou parâmetros, permitindo modificar ou extender seu comportamento sem alterar seu código original. Em TypeScript, para habilitar decorators, é necessário configurar o `tsconfig.json` com as opções `experimentalDecorators` e `emitDecoratorMetadata`.

### Decorator Factories

Decorator factories são funções que retornam um decorator. Eles permitem parametrizar a criação de decoradores, ou seja, você pode passar argumentos que influenciam o comportamento do decorator final. Essa abordagem é extremamente útil para criar decoradores reutilizáveis e configuráveis.

**Exemplo Conceitual:**

```tsx
function Log(prefix: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      console.log(`${prefix} - Chamando ${propertyKey} com`, args);
      const result = originalMethod.apply(this, args);
      console.log(`${prefix} - ${propertyKey} retornou`, result);
      return result;
    };
    return descriptor;
  };
}

```

Neste exemplo, `Log` é um decorator factory que cria um decorator configurado com um prefixo para logging.

### Composição de Decoradores

A composição de decoradores refere-se à aplicação de múltiplos decoradores em um mesmo elemento (classe, método, propriedade ou parâmetro) para combinar funcionalidades. A ordem em que os decoradores são aplicados pode influenciar o comportamento final, sendo processados de baixo para cima (ou de cima para baixo, dependendo do contexto).

**Ponto Importante:**

- A **ordem** de execução dos decoradores é crucial. Por exemplo, se um decorator A for aplicado antes de um decorator B, o comportamento de A poderá afetar B e vice-versa.

### Sintaxe e Estrutura

### Uso Básico de Decorators

Em TypeScript, a sintaxe básica para aplicar um decorator é a seguinte:

```tsx
@MeuDecorator
class MinhaClasse {
  @MeuDecoratorEmMetodo
  meuMetodo() {
    // implementação
  }
}

```

### Criação de Decorator Factories

Para criar um decorator factory, você define uma função que retorna o decorator propriamente dito:

```tsx
function Auditar(acao: string) {
  // Essa é a factory que recebe parâmetros e retorna o decorator.
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const metodoOriginal = descriptor.value;
    descriptor.value = function(...args: any[]) {
      console.log(`Ação: ${acao} - Executando ${propertyKey}`);
      return metodoOriginal.apply(this, args);
    };
    return descriptor;
  };
}

```

Uso do decorator factory:

```tsx
class Operacoes {
  @Auditar('Soma')
  somar(a: number, b: number): number {
    return a + b;
  }
}

const op = new Operacoes();
op.somar(2, 3);

```

### Componentes Principais

### Funções Decoradoras

As funções decoradoras são funções que recebem metadados (como o alvo, a chave da propriedade e o descriptor) e podem modificar ou substituir o comportamento do método/classe. Nos exemplos acima, tanto o `Log` quanto o `Auditar` são funções decoradoras geradas por factories.

### Interação e Combinação de Decoradores

Quando múltiplos decoradores são aplicados ao mesmo elemento, é importante entender como eles interagem:

- **Aplicação Múltipla:**
    
    Você pode aplicar vários decoradores em um método, por exemplo:
    
    ```tsx
    class Exemplo {
      @DecoratorA
      @DecoratorB
      metodo() {
        // implementação
      }
    }
    
    ```
    
    Neste cenário, o decorator `DecoratorB` é aplicado primeiro, seguido por `DecoratorA`.
    
- **Composição Dinâmica:**
    
    Você pode combinar decorators através de factories para criar decorators compostos que encapsulam múltiplas funcionalidades. Por exemplo:
    
    ```tsx
    function Composto(...decorators: MethodDecorator[]): MethodDecorator {
      return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        for (const decorator of decorators) {
          decorator(target, propertyKey, descriptor);
        }
        return descriptor;
      };
    }
    
    ```
    
    Esse decorator composto permite aplicar uma série de decorators de forma sequencial:
    
    ```tsx
    class Calculadora {
      @Composto(
        Auditar('Operação'),
        Log('DEBUG')
      )
      multiplicar(a: number, b: number): number {
        return a * b;
      }
    }
    
    ```
    

### Uso Avançado

### Casos de Uso Reais e Complexos

- **Injeção de Dependências:**
    
    Decorators podem ser utilizados para gerenciar a injeção de dependências em frameworks como Angular. Ao criar decorator factories, é possível parametrizar e configurar como e quando uma dependência deve ser injetada.
    
- **Validação e Sanitização:**
    
    Ao aplicar múltiplos decoradores a métodos de controle de dados, você pode combinar validação, logging e sanitização de entrada, garantindo que os dados sejam processados corretamente antes de executar a lógica principal.
    
- **Monitoramento e Auditoria:**
    
    Decorators compostos podem ser usados para adicionar funcionalidades de monitoramento, como logging e auditoria, sem alterar o corpo dos métodos. Essa abordagem permite rastrear chamadas de métodos e registrar informações críticas de forma centralizada.
    

## 4. Exemplos de Código Otimizados

### Exemplo 1: Decorator Factory para Logging Personalizado

```tsx
// Decorator factory que permite configurar um prefixo para o log.
function Log(prefix: string): MethodDecorator {
  return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      console.log(`${prefix} - Executando ${String(propertyKey)} com argumentos:`, args);
      const result = originalMethod.apply(this, args);
      console.log(`${prefix} - Resultado de ${String(propertyKey)}:`, result);
      return result;
    };
    return descriptor;
  };
}

class Matematica {
  @Log('INFO')
  somar(a: number, b: number): number {
    return a + b;
  }
}

const math = new Matematica();
math.somar(5, 7);

```

### Exemplo 2: Composição de Decoradores com Decorator Composto

```tsx
// Decorator que audita a execução de um método.
function Auditar(acao: string): MethodDecorator {
  return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      console.log(`Auditando ação: ${acao} - Método: ${String(propertyKey)}`);
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

// Decorator para medir o tempo de execução do método.
function MedirTempo(): MethodDecorator {
  return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const inicio = performance.now();
      const result = originalMethod.apply(this, args);
      const fim = performance.now();
      console.log(`Tempo de execução de ${String(propertyKey)}: ${fim - inicio} ms`);
      return result;
    };
    return descriptor;
  };
}

// Decorator composto que aplica uma sequência de decoradores.
function Composto(...decorators: MethodDecorator[]): MethodDecorator {
  return function(target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    for (const decorator of decorators) {
      decorator(target, propertyKey, descriptor);
    }
    return descriptor;
  };
}

class OperacoesComplexas {
  @Composto(
    Auditar('Operação Complexa'),
    MedirTempo()
  )
  calcular(a: number, b: number): number {
    // Simulação de operação complexa
    for (let i = 0; i < 1e6; i++) {}
    return a * b;
  }
}

const operacoes = new OperacoesComplexas();
operacoes.calcular(8, 9);

```

## 5. Informações Adicionais

- **Configuração do TypeScript:**
    
    Certifique-se de habilitar `experimentalDecorators` no arquivo `tsconfig.json`:
    
    ```json
    {
      "compilerOptions": {
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
      }
    }
    
    ```
    
- **Depreciação e Padrões:**
    
    Como os decorators são uma funcionalidade experimental, esteja atento às mudanças na especificação e na implementação futura do TypeScript e do ECMAScript.
    
- **Testes e Debugging:**
    
    Ao utilizar decoradores compostos, é importante realizar testes unitários para garantir que a ordem de aplicação e a interação entre os decoradores estejam funcionando conforme esperado.
    
- **Melhores Práticas:**
    - Mantenha cada decorator com uma única responsabilidade.
    - Utilize decorator factories para parametrização e flexibilidade.
    - Documente a ordem de execução quando múltiplos decoradores forem compostos.

## 6. Referências para Estudo Independente

- [Documentação Oficial do TypeScript sobre Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [Artigo: "Understanding TypeScript Decorators"](https://blog.logrocket.com/understanding-typescript-decorators/)
- [Livro: "Programming TypeScript" por Boris Cherny](https://www.oreilly.com/library/view/programming-typescript/9781492037644/)
- [Tutorial: "TypeScript Decorators Deep Dive"](https://medium.com/@lattmann/deep-dive-into-typescript-decorators-b2f7c7a9d24b)

---

Este guia oferece uma visão detalhada sobre como utilizar decorator factories e compor múltiplos decoradores em TypeScript para criar soluções dinâmicas e configuráveis. Com essa base, desenvolvedores podem explorar cenários avançados e aplicar boas práticas para manter o código modular e escalável.