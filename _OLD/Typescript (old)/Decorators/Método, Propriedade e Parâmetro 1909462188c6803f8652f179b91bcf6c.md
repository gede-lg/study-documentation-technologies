# Método, Propriedade e Parâmetro

## 1. Introdução

Os **decorators** em TypeScript são uma ferramenta poderosa que permite adicionar metaprogramação a classes, métodos, propriedades e parâmetros. Eles possibilitam a extensão e a modificação do comportamento de elementos do código de forma declarativa, promovendo maior flexibilidade, reutilização e organização em projetos de software.

### Relevância e Importância

- **Extensibilidade:** Permite modificar o comportamento de funções, métodos e propriedades sem alterar diretamente o código original.
- **Organização:** Facilita a separação de preocupações (separation of concerns) ao isolar lógica transversal, como logging, validação e injeção de dependências.
- **Reutilização:** Promove a reutilização de funcionalidades comuns em diferentes partes da aplicação.
- **Aspect-Oriented Programming (AOP):** Habilita técnicas de programação orientada a aspectos, permitindo injetar comportamentos em pontos estratégicos do código.

## 2. Sumário

1. [Definição e Conceitos Fundamentais](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#defini%C3%A7%C3%A3o-e-conceitos-fundamentais)
    - [Decorators: Conceito Geral](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#decorators-conceito-geral)
    - [Tipos de Decorators](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#tipos-de-decorators)
2. [Sintaxe e Estrutura](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#sintaxe-e-estrutura)
    - [Declaração e Uso Básico](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#declara%C3%A7%C3%A3o-e-uso-b%C3%A1sico)
3. [Componentes Principais](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#componentes-principais)
    - [Decorador de Método](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#decorador-de-m%C3%A9todo)
    - [Decorador de Propriedade](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#decorador-de-propriedade)
    - [Decorador de Parâmetro](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#decorador-de-par%C3%A2metro)
4. [Uso Avançado](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#uso-avan%C3%A7ado)
5. [Exemplos de Código Otimizados](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#exemplos-de-c%C3%B3digo-otimizados)
6. [Informações Adicionais](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#informa%C3%A7%C3%B5es-adicionais)
7. [Referências para Estudo Independente](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#refer%C3%AAncias-para-estudo-independente)

## 3. Conteúdo Detalhado

### Definição e Conceitos Fundamentais

### Decorators: Conceito Geral

Decorators são funções que podem ser aplicadas a classes e seus membros para alterar ou estender o comportamento destes. Em TypeScript, eles são implementados como funções que recebem metadados sobre o alvo (classe, método, propriedade ou parâmetro) e podem modificar seu comportamento.

### Tipos de Decorators

1. **Decoradores de Classe:** Aplicados à definição de uma classe.
2. **Decoradores de Método:** Aplicados aos métodos, permitindo modificar, envolver ou interceptar chamadas.
3. **Decoradores de Propriedade:** Aplicados às propriedades, possibilitando, por exemplo, injeção de valores ou validações.
4. **Decoradores de Parâmetro:** Aplicados aos parâmetros dos métodos, podendo ser usados para validação ou anotação de metadados.

Neste guia, focaremos nos **decoradores de método, propriedade e parâmetro**, explicando seus usos específicos e como implementá-los.

### Sintaxe e Estrutura

Em TypeScript, para habilitar os decorators, é necessário configurar o arquivo `tsconfig.json` com a opção `"experimentalDecorators": true`.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    // outras opções...
  }
}

```

A sintaxe básica de um decorator é a de uma função que recebe parâmetros específicos dependendo do alvo:

- **Método:** `target`, `propertyKey`, e `descriptor`.
- **Propriedade:** `target` e `propertyKey`.
- **Parâmetro:** `target`, `propertyKey` e `parameterIndex`.

Exemplo de declaração de um decorator simples:

```tsx
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Chamando ${propertyKey} com argumentos:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Resultado de ${propertyKey}:`, result);
    return result;
  };
  return descriptor;
}

```

### Componentes Principais

### Decorador de Método

**Uso Específico:**

- Permite interceptar chamadas a métodos.
- Útil para logging, cache, monitoramento de performance, etc.

**Parâmetros:**

- `target`: Prototipo da classe.
- `propertyKey`: Nome do método.
- `descriptor`: Descriptor da propriedade, que inclui o método original.

**Exemplo:**

```tsx
function logExecutionTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.time(propertyKey);
    const result = originalMethod.apply(this, args);
    console.timeEnd(propertyKey);
    return result;
  };
  return descriptor;
}

class Calculator {
  @logExecutionTime
  compute(n: number): number {
    // Simulação de processamento pesado
    for (let i = 0; i < 1e6; i++) {}
    return n * n;
  }
}

const calc = new Calculator();
calc.compute(5);

```

### Decorador de Propriedade

**Uso Específico:**

- Permite modificar ou monitorar o acesso a propriedades.
- Pode ser usado para injeção de dependências ou para aplicar validações automáticas.

**Parâmetros:**

- `target`: Prototipo da classe (ou a função construtora, se a propriedade for estática).
- `propertyKey`: Nome da propriedade.

**Exemplo:**

```tsx
function readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false
  });
}

class Person {
  @readonly
  name: string = 'João';
}

const person = new Person();
// person.name = 'Maria'; // Isto geraria um erro em tempo de execução ou falha silenciosa dependendo do modo estrito.

```

### Decorador de Parâmetro

**Uso Específico:**

- Permite injetar metadados ou realizar validações nos parâmetros de métodos.
- Útil para frameworks que dependem de injeção de dependências ou para validar os dados de entrada.

**Parâmetros:**

- `target`: Prototipo da classe.
- `propertyKey`: Nome do método.
- `parameterIndex`: Índice do parâmetro na lista de argumentos.

**Exemplo:**

```tsx
function required(target: any, propertyKey: string, parameterIndex: number) {
  const existingRequiredParameters: number[] = Reflect.getOwnMetadata('required', target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata('required', existingRequiredParameters, target, propertyKey);
}

class UserService {
  greet(@required name: string) {
    console.log(`Olá, ${name}!`);
  }
}

// Em um cenário real, você pode criar um decorator de método que verifique os parâmetros marcados como "required"
// antes de executar o método. Exemplo abaixo:

function validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    const requiredParameters: number[] = Reflect.getOwnMetadata('required', target, propertyKey) || [];
    for (const index of requiredParameters) {
      if (args[index] === undefined || args[index] === null) {
        throw new Error(`Parâmetro na posição ${index} é obrigatório.`);
      }
    }
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

class AdvancedUserService {
  @validate
  greet(@required name: string) {
    console.log(`Olá, ${name}!`);
  }
}

const service = new AdvancedUserService();
// service.greet(undefined); // Lançaria um erro: Parâmetro na posição 0 é obrigatório.
service.greet('Maria');

```

### Uso Avançado

Além dos exemplos básicos, os decorators podem ser combinados e parametrizados para cenários mais complexos:

- **Parametrização de Decorators:** Permite passar parâmetros para o decorator, personalizando seu comportamento.
    
    ```tsx
    function debounce(delay: number) {
      return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        let timeout: any;
        descriptor.value = function(...args: any[]) {
          clearTimeout(timeout);
          timeout = setTimeout(() => originalMethod.apply(this, args), delay);
        };
        return descriptor;
      };
    }
    
    class SearchComponent {
      @debounce(300)
      onSearch(query: string) {
        console.log(`Buscando por: ${query}`);
      }
    }
    
    ```
    
- **Composição de Decorators:** Vários decorators podem ser aplicados a um mesmo elemento, sendo executados na ordem definida (de baixo para cima, conforme a especificação do TypeScript).
- **Uso de Metadata Reflection API:** Para casos onde é necessário armazenar e acessar metadados adicionais, a [Metadata Reflection API](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata) pode ser integrada aos decorators.

## 4. Exemplos de Código Otimizados

### Exemplo Completo com Decoradores de Método, Propriedade e Parâmetro

```tsx
import 'reflect-metadata';

// Decorador para marcar parâmetros obrigatórios
function required(target: any, propertyKey: string, parameterIndex: number) {
  const existingRequiredParameters: number[] = Reflect.getOwnMetadata('required', target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata('required', existingRequiredParameters, target, propertyKey);
}

// Decorador para validar os parâmetros marcados com @required
function validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    const requiredParameters: number[] = Reflect.getOwnMetadata('required', target, propertyKey) || [];
    for (const index of requiredParameters) {
      if (args[index] === undefined || args[index] === null) {
        throw new Error(`Parâmetro na posição ${index} é obrigatório.`);
      }
    }
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

// Decorador para marcar propriedades como somente leitura
function readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
    configurable: false
  });
}

// Decorador para logar o tempo de execução de um método
function logExecutionTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.time(propertyKey);
    const result = originalMethod.apply(this, args);
    console.timeEnd(propertyKey);
    return result;
  };
  return descriptor;
}

class ExampleService {
  @readonly
  serviceName: string = 'ExampleService';

  @validate
  @logExecutionTime
  process(@required data: any) {
    // Simulação de processamento
    for (let i = 0; i < 1e6; i++) {}
    return `Processed: ${JSON.stringify(data)}`;
  }
}

const service = new ExampleService();
console.log(`Serviço: ${service.serviceName}`);
try {
  // Descomente a linha abaixo para ver a validação em ação (gerará um erro se data for undefined)
  // service.process(undefined);
  console.log(service.process({ key: 'value' }));
} catch (error) {
  console.error(error);
}

```

### Boas Práticas

- **Clareza e Simplicidade:** Mantenha os decorators simples e com responsabilidades bem definidas.
- **Composição Controlada:** Ao combinar múltiplos decorators, tenha clareza sobre a ordem de execução.
- **Documentação:** Sempre documente a finalidade e o comportamento dos decorators para facilitar a manutenção.
- **Uso Consciente:** Use decorators para cenários que realmente se beneficiam da metaprogramação, evitando abusos que possam prejudicar a legibilidade do código.

## 5. Informações Adicionais

- **Interoperabilidade com Frameworks:** Muitos frameworks modernos, como Angular, fazem uso intensivo de decorators para funcionalidades como injeção de dependências, definição de componentes e roteamento.
- **Debugging:** Ao usar decorators, esteja atento às mudanças no fluxo de execução do código. Ferramentas de debugging e testes unitários podem ajudar a identificar problemas.
- **Limitações:** Lembre-se que os decorators são uma funcionalidade experimental e podem sofrer alterações nas futuras versões do TypeScript/ECMAScript.

## 6. Referências para Estudo Independente

- [Documentação Oficial do TypeScript sobre Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [ECMAScript Decorators Proposal](https://github.com/tc39/proposal-decorators)
- [Understanding TypeScript Decorators](https://blog.logrocket.com/understanding-typescript-decorators/)
- [Reflect Metadata API](https://rbuckton.github.io/reflect-metadata/)
- [Livro: "Programming TypeScript" por Boris Cherny](https://www.oreilly.com/library/view/programming-typescript/9781492037644/)

---

Este guia proporciona uma visão abrangente sobre decorators em TypeScript, com foco em decoradores de método, propriedade e parâmetro. Através dos exemplos e explicações detalhadas, você pode aplicar essas técnicas para escrever código mais modular, limpo e extensível.