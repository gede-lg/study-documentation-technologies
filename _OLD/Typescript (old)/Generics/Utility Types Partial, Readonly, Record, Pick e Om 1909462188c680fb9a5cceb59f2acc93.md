# Utility Types: Partial, Readonly, Record, Pick e Omit.

---

# 1. Introdução

Os **Generics** (ou *genéricos*) no TypeScript permitem que funções, classes e interfaces sejam escritas de forma a trabalhar com múltiplos tipos sem perder a segurança de tipagem. Essa abordagem possibilita a criação de componentes reutilizáveis e adaptáveis a diferentes contextos. Dentro desse universo, os **Utility Types** são um conjunto de tipos pré-definidos que auxiliam na transformação e manipulação de outros tipos, facilitando a definição de contratos e estruturas de dados mais flexíveis.

Esses conceitos são fundamentais para desenvolver aplicações escaláveis e robustas, já que permitem reduzir a repetição de código e melhorar a expressividade do sistema de tipos.

---

# 2. Sumário

1. [Definição e Conceitos Fundamentais](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#defini%C3%A7%C3%A3o-e-conceitos-fundamentais)
    - Generics
    - Utility Types
2. [Sintaxe e Estrutura](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#sintaxe-e-estrutura)
    - Declaração e utilização dos Utility Types
    - Exemplos práticos
3. [Componentes Principais](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#componentes-principais)
    - Funções, classes e interfaces com generics
    - Interação com os Utility Types
4. [Uso Avançado](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#uso-avan%C3%A7ado)
    - Casos de uso complexos e integração em APIs
    - Estratégias para composição de tipos com Utility Types
5. [Exemplos de Código Otimizados](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#exemplos-de-c%C3%B3digo-otimizados)
    - Exemplos comentados e práticas recomendadas
6. [Informações Adicionais](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#informa%C3%A7%C3%B5es-adicionais)
    - Nuances e detalhes relevantes
7. [Referências para Estudo Independente](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#refer%C3%AAncias-para-estudo-independente)

---

# 3. Conteúdo Detalhado

## Definição e Conceitos Fundamentais

### Generics

Generics permitem que componentes sejam escritos de forma independente dos tipos específicos que irão manipular. Ao invés de fixar um tipo, você define um parâmetro de tipo que será especificado quando o componente for utilizado.

**Conceito Básico:**

- Permite reutilização de código para diferentes tipos mantendo a segurança de tipagem.

**Conceito Avançado:**

- Pode ser combinado com restrições (`extends`), condicionais e mapeamento de tipos para criar soluções altamente flexíveis.

### Utility Types

Os Utility Types são tipos utilitários padrão do TypeScript que ajudam a transformar ou construir novos tipos a partir de tipos já existentes. Eles simplificam tarefas comuns na manipulação de tipos.

**Principais Utility Types abordados:**

- **`Partial<T>`:** Torna todas as propriedades de um tipo `T` opcionais.
- **`Readonly<T>`:** Torna todas as propriedades de `T` somente leitura.
- **`Record<K, T>`:** Cria um tipo objeto cujas chaves são do tipo `K` e os valores do tipo `T`.
- **`Pick<T, K>`:** Cria um novo tipo com um subconjunto de propriedades de `T` especificadas em `K`.
- **`Omit<T, K>`:** Cria um novo tipo removendo as propriedades de `T` especificadas em `K`.

**Conceito Básico:**

- Facilita a transformação de tipos de forma simples e reutilizável.

**Conceito Avançado:**

- Pode ser combinado com Generics para criar APIs flexíveis e tipadas dinamicamente, suportando operações complexas de composição e transformação de tipos.

---

## Sintaxe e Estrutura

### Declaração e Utilização dos Utility Types

### `Partial<T>`

Torna todas as propriedades de um tipo opcionais.

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

const updateUser = (id: number, user: Partial<User>): void => {
  // Apenas as propriedades a serem atualizadas podem ser passadas.
  console.log(`Atualizando usuário ${id} com`, user);
};

updateUser(1, { email: "novoemail@exemplo.com" });

```

### `Readonly<T>`

Garante que as propriedades do tipo não possam ser modificadas após a criação.

```tsx
const user: Readonly<User> = {
  id: 1,
  name: "Alice",
  email: "alice@exemplo.com"
};

// Erro: não é possível atribuir um novo valor
// user.email = "novoemail@exemplo.com";

```

### `Record<K, T>`

Cria um objeto onde as chaves são do tipo `K` e os valores do tipo `T`.

```tsx
type Role = "admin" | "user" | "guest";
const roles: Record<Role, string[]> = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
};

```

### `Pick<T, K>`

Seleciona um conjunto específico de propriedades de um tipo.

```tsx
interface FullUser {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserPreview = Pick<FullUser, "id" | "name">;

const preview: UserPreview = {
  id: 1,
  name: "Alice"
};

```

### `Omit<T, K>`

Remove um conjunto de propriedades de um tipo para criar um novo tipo.

```tsx
type UserWithoutEmail = Omit<FullUser, "email">;

const userWithoutEmail: UserWithoutEmail = {
  id: 1,
  name: "Alice",
  age: 30
};

```

---

## Componentes Principais

### Funções, Classes e Interfaces com Generics

- **Funções Genéricas:** Permitem que os Utility Types sejam aplicados dinamicamente, baseando-se em tipos passados como parâmetros.
- **Interfaces e Classes:** Podem usar Generics para definir estruturas de dados que se adaptam conforme a necessidade, combinando com Utility Types para extrair ou modificar partes dessas estruturas.

### Interação com os Utility Types

- **Composição de Tipos:** É comum usar Utility Types para compor novos tipos a partir de tipos existentes, facilitando a manutenção e evolução da base de código.
- **Segurança de Tipos:** Ao utilizar Utility Types, os desenvolvedores garantem que as operações e transformações realizadas nos tipos respeitem os contratos definidos, evitando erros comuns em tempo de compilação.

---

## Uso Avançado

### Casos de Uso Complexos e Integração em APIs

- **Atualizações Parciais de Objetos:** Ao atualizar registros em um banco de dados, o uso de `Partial<T>` permite que apenas os campos modificados sejam enviados, mantendo a segurança e a integridade dos dados.
- **Criação de Objetos Imutáveis:** `Readonly<T>` é essencial em sistemas onde a imutabilidade é desejada para evitar efeitos colaterais indesejados.
- **Mapeamento de Dados:** Com `Record<K, T>`, é possível definir mapeamentos rígidos entre chaves e valores, como configurações ou dicionários de permissões.
- **Extração de Dados Específicos:** Utilizar `Pick<T, K>` e `Omit<T, K>` facilita a criação de visões (views) especializadas de um objeto, por exemplo, ao expor apenas os dados necessários em uma API.

### Estratégias para Composição de Tipos

- **Combinação de Utility Types:** É possível combinar vários Utility Types para criar tipos sofisticados, por exemplo, usar `Omit` em conjunto com `Partial` para definir um objeto onde certas propriedades são opcionais e outras são removidas.
- **Utilização em Componentes de Bibliotecas:** Ao desenvolver bibliotecas ou frameworks, o uso avançado de Generics junto com Utility Types possibilita criar APIs que se adaptam a diferentes cenários de uso sem perder a robustez da tipagem.

---

## Exemplos de Código Otimizados

### Exemplo 1: Atualização Parcial de um Objeto com `Partial<T>`

```tsx
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const updateUser = (id: number, userUpdates: Partial<User>): User => {
  // Simulação de busca e atualização de usuário
  const user: User = {
    id,
    name: "Alice",
    email: "alice@exemplo.com",
    age: 30
  };
  return { ...user, ...userUpdates };
};

const updatedUser = updateUser(1, { email: "novaalice@exemplo.com", age: 31 });
console.log(updatedUser);

```

### Exemplo 2: Criação de Tipos Imutáveis com `Readonly<T>`

```tsx
interface Config {
  url: string;
  port: number;
  secure: boolean;
}

const config: Readonly<Config> = {
  url: "https://api.exemplo.com",
  port: 443,
  secure: true
};

// Tentativa de modificação resultará em erro de compilação
// config.port = 80;
console.log(config);

```

### Exemplo 3: Mapeamento com `Record<K, T>`

```tsx
type Permission = "read" | "write" | "delete";
const permissions: Record<Permission, boolean> = {
  read: true,
  write: false,
  delete: false
};

console.log(permissions);

```

### Exemplo 4: Selecionando Propriedades com `Pick<T, K>` e Excluindo com `Omit<T, K>`

```tsx
interface FullUser {
  id: number;
  name: string;
  email: string;
  age: number;
  address: string;
}

// Criar um tipo apenas com as propriedades essenciais para visualização
type UserPreview = Pick<FullUser, "id" | "name" | "email">;
const previewUser: UserPreview = {
  id: 1,
  name: "Alice",
  email: "alice@exemplo.com"
};

// Criar um tipo removendo informações sensíveis
type SafeUser = Omit<FullUser, "email" | "address">;
const safeUser: SafeUser = {
  id: 1,
  name: "Alice",
  age: 30
};

console.log(previewUser, safeUser);

```

---

## Informações Adicionais

- **Combinação e Composição:** Os Utility Types podem ser aninhados ou combinados para resolver cenários complexos. Por exemplo, você pode usar `Partial` em um tipo que foi previamente modificado por `Pick`.
- **Manutenção e Escalabilidade:** Utilizar esses tipos utilitários torna o código mais fácil de manter, pois as transformações dos tipos ficam centralizadas e reutilizáveis.
- **Ferramentas de Desenvolvimento:** IDEs como o Visual Studio Code fornecem excelente suporte ao TypeScript, oferecendo autocompletar, verificação de tipos e sugestões que facilitam a utilização dos Utility Types.

---

## Referências para Estudo Independente

1. **Documentação Oficial do TypeScript**
    - [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
    - [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
2. **Artigos e Tutoriais**
    - [Understanding TypeScript Utility Types](https://dev.to/rammyblog/understanding-typescript-utility-types-1pbm)
    - [Mastering TypeScript Generics](https://medium.com/@basarat/mastering-typescript-generics-99e23b0f8b5c)
3. **Livros**
    - *Programming TypeScript* por Boris Cherny
    - *TypeScript Quickly* por Yakov Fain e Anton Moiseev

---

Esta explicação detalhada visa fornecer uma compreensão abrangente sobre os Generics e os Utility Types no TypeScript, enfatizando como esses conceitos podem ser aplicados para criar código mais flexível, seguro e reutilizável. Se houver dúvidas ou a necessidade de explorar casos específicos, as referências listadas são excelentes pontos de partida para aprofundamento.