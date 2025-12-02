# Getters e Setters

## 1. Introdução

Getters e setters são métodos especiais que permitem acessar e modificar as propriedades de um objeto de forma controlada. No contexto do TypeScript, eles são utilizados para implementar encapsulamento, uma prática essencial na programação orientada a objetos, garantindo que os dados internos sejam manipulados apenas por métodos definidos, permitindo validação, logging, ou outras ações auxiliares. Esses recursos são fundamentais para criar classes robustas, manter a integridade dos dados e simplificar a manutenção do código.

## 2. Sumário

- [Introdução](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#1-introdu%C3%A7%C3%A3o)
- [Definição e Conceitos Fundamentais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#3-defini%C3%A7%C3%A3o-e-conceitos-fundamentais)
    - [O que são Getters e Setters](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#o-que-s%C3%A3o-getters-e-setters)
    - [Encapsulamento e Validação de Dados](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#encapsulamento-e-valida%C3%A7%C3%A3o-de-dados)
- [Sintaxe e Estrutura em TypeScript](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#4-sintaxe-e-estrutura-em-typescript)
    - [Declaração de Getters e Setters](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#declara%C3%A7%C3%A3o-de-getters-e-setters)
    - [Exemplos Básicos](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#exemplos-b%C3%A1sicos)
- [Componentes Principais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#5-componentes-principais)
    - [Funções dos Getters](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#fun%C3%A7%C3%B5es-dos-getters)
    - [Funções dos Setters](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#fun%C3%A7%C3%B5es-dos-setters)
    - [Interação entre Getters e Setters](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#intera%C3%A7%C3%A3o-entre-getters-e-setters)
- [Uso Avançado](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#6-uso-avan%C3%A7ado)
    - [Validação de Dados Complexa](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#valida%C3%A7%C3%A3o-de-dados-complexa)
    - [Casos de Uso Reais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#casos-de-uso-reais)
- [Exemplos de Código Otimizados](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#7-exemplos-de-c%C3%B3digo-otimizados)
- [Informações Adicionais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#8-informa%C3%A7%C3%B5es-adicionais)
- [Referências para Estudo Independente](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#9-refer%C3%AAncias-para-estudo-independente)

## 3. Definição e Conceitos Fundamentais

### O que são Getters e Setters

- **Getters**: São métodos utilizados para **acessar** os valores de propriedades privadas ou protegidas de uma classe. Eles permitem que o acesso seja controlado e, em alguns casos, até computado dinamicamente.
- **Setters**: São métodos responsáveis por **modificar** os valores dessas propriedades. Além de atribuir valores, eles podem incluir lógica de validação ou transformação dos dados antes de realizar a alteração.

### Encapsulamento e Validação de Dados

- **Encapsulamento**: Ao utilizar getters e setters, você esconde a implementação interna da classe e expõe apenas uma interface controlada. Isso melhora a segurança e a integridade dos dados.
- **Validação de Dados**: Os setters podem incorporar regras de validação para assegurar que apenas dados válidos sejam atribuídos às propriedades da classe, evitando estados inconsistentes e erros durante a execução.

## 4. Sintaxe e Estrutura em TypeScript

### Declaração de Getters e Setters

Em TypeScript, getters e setters são declarados utilizando as palavras-chave `get` e `set` dentro de uma classe. A seguir, um exemplo simples:

```tsx
class Pessoa {
  private _nome: string;

  constructor(nome: string) {
    this._nome = nome;
  }

  // Getter: método para acessar o nome
  public get nome(): string {
    return this._nome;
  }

  // Setter: método para modificar o nome com validação
  public set nome(novoNome: string) {
    if (novoNome && novoNome.length > 0) {
      this._nome = novoNome;
    } else {
      throw new Error("Nome inválido!");
    }
  }
}

const pessoa = new Pessoa("João");
console.log(pessoa.nome);  // Saída: João

pessoa.nome = "Maria";       // Atualiza o nome com sucesso
console.log(pessoa.nome);    // Saída: Maria

// pessoa.nome = "";        // Lançará um erro: Nome inválido!

```

### Exemplos Básicos

- **Exemplo de Getter**: Permite a leitura de `_nome` de forma segura.
- **Exemplo de Setter**: Verifica se o novo valor é válido antes de alterar o estado interno.

## 5. Componentes Principais

### Funções dos Getters

- **Acesso Controlado**: Permitem que os valores internos sejam lidos sem expor diretamente os campos privados.
- **Cálculos Dinâmicos**: Podem retornar valores calculados com base em outras propriedades da classe.

### Funções dos Setters

- **Validação de Dados**: Realizam verificações ou transformações antes de definir o novo valor.
- **Encapsulamento**: Evitam alterações diretas e não controladas em propriedades sensíveis.

### Interação entre Getters e Setters

- **Sinergia**: Enquanto o getter fornece acesso ao valor, o setter garante que qualquer alteração passe por uma camada de validação.
- **Consistência**: Juntos, eles garantem que os dados do objeto permaneçam consistentes e válidos durante todo o ciclo de vida da instância.

## 6. Uso Avançado

### Validação de Dados Complexa

Em cenários avançados, os setters podem incluir:

- **Validações Multi-Camadas**: Verificar diferentes critérios antes de atualizar o valor.
- **Transformações**: Converter ou formatar os dados recebidos antes de armazená-los.
- **Notificações**: Acionar eventos ou logs quando um valor é alterado.

### Exemplo Avançado de Setter com Validação e Notificação:

```tsx
class Produto {
  private _preco: number;

  constructor(preco: number) {
    this._preco = preco;
  }

  public get preco(): number {
    return this._preco;
  }

  public set preco(novoPreco: number) {
    if (novoPreco < 0) {
      console.error("Preço não pode ser negativo.");
      return;
    }
    console.log(`Atualizando o preço de ${this._preco} para ${novoPreco}`);
    this._preco = novoPreco;
  }
}

const produto = new Produto(50);
produto.preco = 70;   // Atualiza o preço e loga a alteração
produto.preco = -10;  // Exibe erro e não altera o preço

```

### Casos de Uso Reais

- **Formulários de Entrada**: Validação de campos antes de enviar dados para uma API.
- **Interfaces de Usuário**: Atualizar dinamicamente valores exibidos na interface com base em mudanças de estado.
- **Sistemas de Configuração**: Controlar alterações em configurações de software, garantindo que cada mudança siga regras predefinidas.

## 7. Exemplos de Código Otimizados

### Exemplo Completo de Classe com Getters e Setters

```tsx
class Usuario {
  // Propriedades privadas
  private _email: string;
  private _idade: number;

  constructor(email: string, idade: number) {
    this._email = email;
    this._idade = idade;
  }

  // Getter para email
  public get email(): string {
    return this._email;
  }

  // Setter para email com validação simples
  public set email(novoEmail: string) {
    if (novoEmail.includes("@")) {
      this._email = novoEmail;
    } else {
      throw new Error("Email inválido!");
    }
  }

  // Getter para idade
  public get idade(): number {
    return this._idade;
  }

  // Setter para idade com validação de faixa etária
  public set idade(novaIdade: number) {
    if (novaIdade >= 0 && novaIdade <= 150) {
      this._idade = novaIdade;
    } else {
      throw new Error("Idade inválida!");
    }
  }
}

// Demonstração de uso
const usuario = new Usuario("teste@example.com", 30);
console.log(usuario.email, usuario.idade);

// Atualizações válidas
usuario.email = "novoemail@example.com";
usuario.idade = 35;
console.log(usuario.email, usuario.idade);

// Tentativa de atualização inválida (descomente para testar)
// usuario.email = "email_invalido";   // Lança erro
// usuario.idade = 200;                // Lança erro

```

> Dica: Sempre comente e documente seu código para facilitar a manutenção e a compreensão dos outros desenvolvedores.
> 

## 8. Informações Adicionais

- **Boas Práticas**:
    - Mantenha a lógica de validação dentro dos setters para centralizar o controle dos dados.
    - Use nomes descritivos para métodos getters e setters para facilitar a leitura e o entendimento do código.
    - Evite lógica excessivamente complexa dentro dos getters; se necessário, considere mover a lógica para métodos auxiliares.
- **Limitações e Considerações**:
    - Em alguns casos, o uso de getters e setters pode introduzir overhead se não forem utilizados com cautela.
    - Considere a legibilidade e a performance, especialmente em aplicações de larga escala.
- **Integração com Outras Funcionalidades**:
    - Getters e setters podem ser combinados com outros recursos do TypeScript, como interfaces e decorators, para criar padrões de design mais robustos e flexíveis.

## 9. Referências para Estudo Independente

- **Documentação Oficial do TypeScript**
    
    [TypeScript Handbook - Classes](https://www.typescriptlang.org/docs/handbook/classes.html)
    
- **Artigos e Tutoriais**
    - [Understanding Getters and Setters in TypeScript](https://blog.logrocket.com/getters-setters-typescript/)
    - [Encapsulation in TypeScript: A Deep Dive](https://www.digitalocean.com/community/tutorials/encapsulation-in-typescript)
- **Livros**
    - *Programming TypeScript* de Boris Cherny
    - *TypeScript Quickly* de Yakov Fain e Anton Moiseev
- **Cursos Online**
    - [Udemy: Mastering TypeScript](https://www.udemy.com/course/mastering-typescript/)
    - [Pluralsight: Advanced TypeScript](https://www.pluralsight.com/courses/advanced-typescript)

---

Este guia oferece uma visão completa sobre o uso de getters e setters em TypeScript, destacando desde os conceitos básicos até casos de uso avançados. Ao compreender esses mecanismos, você poderá criar aplicações mais robustas, seguras e fáceis de manter.