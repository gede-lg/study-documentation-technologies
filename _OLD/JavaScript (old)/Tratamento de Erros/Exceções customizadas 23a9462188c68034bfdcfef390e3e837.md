# Exceções customizadas

Com certeza, Gedê\! Vamos mergulhar no mundo das exceções personalizadas em JavaScript. Como desenvolvedor Backend Java em transição para Go, você já está familiarizado com o conceito de tratamento de erros, e JavaScript também oferece ferramentas poderosas para isso.

---

## Exceções Personalizadas em JavaScript

### Introdução

No desenvolvimento de software, a **robustez** é crucial. Nossos sistemas precisam lidar com situações inesperadas sem falhar de forma catastrófica. As **exceções** são um mecanismo fundamental para isso, permitindo que o programa "salte" do fluxo normal de execução quando algo dá errado e vá para um bloco de código que sabe como lidar com o problema. Em JavaScript, as exceções built-in como `TypeError` ou `ReferenceError` cobrem muitos cenários, mas frequentemente precisamos de exceções mais **específicas** para representar erros de domínio ou condições anormais de negócio. É aí que entram as **exceções personalizadas**.

### Sumário

Nesta explicação, vamos abordar os seguintes tópicos:

- **Conceitos Fundamentais:** O que são exceções e por que personalizá-las.
- **Componentes e Arquitetura Teórica:** Como criar exceções personalizadas em JavaScript.
- **Cenários de Aplicação e Limitações:** Onde e quando usar (ou não usar) exceções personalizadas.
- **Melhores Práticas e Padrões de Uso:** Recomendações para um bom design de exceções.
- **Sugestões para Aprofundamento:** Recursos para continuar seus estudos.

---

### Conceitos Fundamentais

### O que é uma Exceção?

Uma **exceção** é um evento que interrompe o fluxo normal de um programa. Quando uma exceção ocorre (é "lançada" ou "thrown"), o controle é transferido para o bloco de código mais próximo que está configurado para "capturá-la" (o bloco `catch`). Se nenhuma função na pilha de chamadas capturar a exceção, o programa geralmente termina.

### Por que Personalizar Exceções?

- **Clareza e Semântica:** Exceções personalizadas tornam o código mais legível e expressivo. Em vez de lançar um `Error` genérico, você pode lançar um `UsuarioNaoEncontradoError`, o que imediatamente comunica a natureza do problema.
- **Tratamento Específico:** Permitem que diferentes partes do seu código capturem e lidem com tipos específicos de erros de maneiras distintas. Por exemplo, você pode ter um `catch` para `ErroDeValidacao` que exibe uma mensagem amigável ao usuário, e outro para `ErroDeConexaoDB` que tenta uma reconexão.
- **Manutenibilidade:** Facilitam a depuração e a manutenção, pois a hierarquia de exceções pode espelhar a lógica de negócios da sua aplicação.
- **Encapsulamento:** Você pode encapsular detalhes internos do erro em sua exceção personalizada, expondo apenas as informações relevantes para quem a captura.

---

### Componentes e Arquitetura Teórica

Em JavaScript, a maneira mais comum e recomendada de criar exceções personalizadas é **estendendo a classe `Error`**.

### Estendendo `Error`

A classe `Error` é a base para todos os objetos de erro em JavaScript. Ao estendê-la, sua exceção personalizada herda propriedades úteis como `name` (o nome do construtor) e `stack` (o stack trace, essencial para depuração).

```jsx
class MeuErroPersonalizado extends Error {
  constructor(message, errorCode = 500) {
    super(message); // Chama o construtor da classe pai (Error)
    this.name = "MeuErroPersonalizado"; // Define o nome da exceção
    this.errorCode = errorCode; // Adiciona propriedades personalizadas
  }
}

// Exemplo de uso:
function processarDados(dados) {
  if (!dados) {
    throw new MeuErroPersonalizado("Dados não podem ser nulos!", 400);
  }
  // Lógica de processamento
  console.log("Dados processados com sucesso!");
}

try {
  processarDados(null);
} catch (error) {
  if (error instanceof MeuErroPersonalizado) {
    console.error(`Erro Personalizado (${error.errorCode}): ${error.message}`);
    console.error(`Stack Trace: ${error.stack}`);
  } else {
    console.error(`Erro inesperado: ${error.message}`);
  }
}

// Outro exemplo:
class ErroDeValidacao extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ErroDeValidacao";
    this.field = field; // Propriedade específica para o campo com erro
  }
}

function validarUsuario(usuario) {
  if (!usuario.nome) {
    throw new ErroDeValidacao("Nome é obrigatório", "nome");
  }
  if (usuario.idade < 18) {
    throw new ErroDeValidacao("Usuário deve ser maior de 18 anos", "idade");
  }
  return true;
}

try {
  validarUsuario({ idade: 16 });
} catch (error) {
  if (error instanceof ErroDeValidacao) {
    console.error(`Erro de Validação no campo '${error.field}': ${error.message}`);
  } else {
    console.error(`Ocorreu um erro desconhecido: ${error.message}`);
  }
}

```

### Anatomia de uma Exceção Personalizada

1. **Herança:** `class MinhaExcecao extends Error`.
2. **Construtor:**
    - `super(message)`: Essencial para inicializar a classe `Error` pai e garantir que a `message` e o `stack` trace sejam configurados corretamente.
    - `this.name = "MinhaExcecao"`: Embora `name` seja herdado, é uma boa prática redefini-lo para o nome da sua classe, tornando o stack trace mais legível.
    - **Propriedades Adicionais:** Você pode adicionar quantas propriedades personalizadas forem necessárias (`errorCode`, `details`, `field`, etc.) para fornecer mais contexto sobre o erro.

---

### Cenários de Aplicação e Limitações

### Quando Usar Exceções Personalizadas

- **Erros de Domínio/Negócio:** Quando a lógica da sua aplicação encontra uma condição inválida que não é um erro de programação (`TypeError`, `ReferenceError`), mas sim uma violação das regras de negócio.
    - Ex: `UsuarioNaoEncontradoError`, `SaldoInsuficienteError`, `ProdutoIndisponivelError`.
- **Validação de Entrada:** Quando dados de entrada não atendem aos critérios esperados.
    - Ex: `ErroDeValidacao`, `ArgumentoInvalidoError`.
- **Integrações Externas:** Para encapsular e diferenciar erros que vêm de APIs externas ou bancos de dados.
    - Ex: `ErroAPIExterna`, `ErroConexaoBD`.
- **Melhor Controle de Fluxo de Erros:** Quando você precisa de uma maneira programática para identificar e reagir a tipos específicos de falhas em diferentes camadas da sua aplicação.

### Limitações e Quando Não Usar

- **Não Abusar:** Não crie uma exceção personalizada para cada pequena validação. Se um simples `if/else` ou o retorno de um valor `null`/`undefined` for suficiente para indicar um erro, use-os. Exceções devem ser para **situações excepcionais**, não para controle de fluxo normal.
- **Performance:** Lançar e capturar exceções pode ter um custo de performance ligeiramente maior do que outros métodos de controle de fluxo, especialmente em loops muito apertados. No entanto, para a maioria das aplicações, o benefício de clareza e manutenção supera esse custo mínimo.
- **Hierarquia Complexa:** Evite criar uma hierarquia de exceções excessivamente profunda e complexa, pois isso pode dificultar o entendimento e a manutenção do código. Mantenha-a o mais simples e plana possível.

---

### Melhores Práticas e Padrões de Uso

1. **Extenda `Error`:** Sempre estenda a classe `Error` para suas exceções personalizadas. Isso garante que elas se comportem como erros nativos e incluam o `stack trace`.
2. **Nomes Descritivos:** Dê nomes claros e descritivos às suas classes de exceção, geralmente terminando com `Error` (ex: `AutenticacaoError`, `PermissaoNegadaError`).
3. **Mensagens Claras:** A mensagem da exceção (`message`) deve ser concisa e informativa, descrevendo o que deu errado.
4. **Propriedades Adicionais:** Adicione propriedades personalizadas relevantes ao seu construtor para fornecer mais contexto sobre o erro (ex: `statusCode`, `detail`, `field`).
5. **Use `instanceof` para Captura:** Utilize `instanceof` no bloco `catch` para verificar o tipo da exceção e tratá-la de forma específica.
6. **Lançar Exceções e Não Ignorá-las:** Não capture uma exceção e simplesmente a ignore. Se você a capturar, deve haver uma lógica para tratá-la ou, no mínimo, relançá-la (propagá-la) para que outro handler possa agir.
7. **Erro Genérico de Fallback:** Sempre tenha um `catch` genérico (`catch (error)`) como fallback para capturar exceções inesperadas que não são dos seus tipos personalizados.
8. **Documentação:** Documente suas exceções personalizadas, explicando quando elas são lançadas e o que significam.

<!-- end list -->

```jsx
// Exemplo de uma boa prática: hierarquia simples
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name; // Pega o nome da classe que estendeu
    this.statusCode = statusCode;
  }
}

class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 400); // Erros de validação geralmente são 400 Bad Request
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404); // 404 Not Found
  }
}

// Exemplo de uso em uma rota Express (conceitual)
async function getUser(req, res, next) {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new ValidationError("ID do usuário é obrigatório", "id");
    }

    const user = await db.findUser(userId); // Suponha um DB call
    if (!user) {
      throw new NotFoundError(`Usuário com ID ${userId} não encontrado`);
    }

    res.json(user);
  } catch (error) {
    // Middleware de tratamento de erros global ou específico aqui
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({ message: error.message, field: error.field });
    } else if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof AppError) { // Captura qualquer outro erro customizado da aplicação
      return res.status(error.statusCode).json({ message: error.message });
    } else { // Erros inesperados ou nativos
      console.error(error); // Log do erro completo para depuração
      return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
    }
    // Ou simplesmente chamar next(error) para um middleware de erro global do Express
  }
}

```

---

### Sugestões para Aprofundamento

- **MDN Web Docs - Error:** Uma excelente referência para a classe `Error` e suas subclasses built-in.
    - `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error`
- **Artigos sobre Tratamento de Erros em Node.js/JavaScript:** Procure por artigos que discutam padrões de tratamento de erros, como o uso de middlewares para erros em frameworks como Express.
- **"Effective JavaScript" (livro):** Embora não seja focado apenas em exceções, é um ótimo recurso para entender as nuances da linguagem.
- **Padrões de Design (GoF - Gang of Four):** Entender padrões como "Chain of Responsibility" pode ajudar a pensar em como as exceções são propagadas e tratadas em um sistema maior. (Embora não seja JS específico, o conceito se aplica).

---

Espero que esta visão aprofundada ajude você, Gedê, a dominar as exceções personalizadas em JavaScript\! Saber quando e como utilizá-las de forma eficaz é uma habilidade valiosa para construir aplicações mais robustas e fáceis de manter.

Se a explicação precisar ser um arquivo Markdown completo, me diga\! Posso gerar para você. Tem mais alguma dúvida sobre o assunto ou quer explorar um exemplo mais específico?