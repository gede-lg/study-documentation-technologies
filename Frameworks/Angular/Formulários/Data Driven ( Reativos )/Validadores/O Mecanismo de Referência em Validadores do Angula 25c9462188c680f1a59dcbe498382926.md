# O Mecanismo de Referência em Validadores do Angular

### **Introdução**

No desenvolvimento com Formulários Reativos no Angular, aplicamos validadores a controles específicos e, como mágica, dentro da função de validação, a variável `control` (ou `formControl`) é uma referência exata àquele controle que queremos validar. Essa não é uma mágica, mas sim um pilar elegante do design do Angular, baseado em dois conceitos-chave: **associação no momento da definição** e **contexto no momento da execução**. Este tópico é dedicado a explicar detalhadamente como essa conexão é forjada e mantida pelo framework.

### **O Princípio Fundamental: Associação no Ponto de Origem**

A ligação entre um validador e um controle é criada no exato momento em que você define seu `FormGroup`. Pense nisso como um ato de registro ou matrícula.

Veja a linha de código familiar:

```tsx
this.meuForm = this.fb.group({
  nome: ['Gedê', [Validators.required, Validators.minLength(3)]],
  email: [null, Validators.email]
});

```

Quando o Angular processa essa definição, ele não executa os validadores imediatamente. Em vez disso, ele realiza as seguintes ações internas:

1. **Cria a Instância:** O Angular cria uma nova instância da classe `FormControl` para o campo `nome`.
2. **Armazena os Validadores:** Dentro dessa instância de `FormControl` (`nome`), existe uma propriedade interna, que podemos imaginar como uma lista ou um array, destinada a guardar suas funções de validação.
3. **Registra as Funções:** O Angular pega cada função que você passou no array (`Validators.required` e `Validators.minLength(3)`) e as **armazena** nessa lista interna, associada exclusivamente ao controle `nome`.

Neste ponto, a função `Validators.required` ainda não sabe nada sobre o valor "Gedê". Ela está apenas "sentada", esperando para ser chamada, sabendo que sua responsabilidade está atrelada ao controle `nome`. A mesma coisa acontece para o controle `email` e seu validador.

**A chave é:** A associação é feita antes de qualquer validação ocorrer. O Angular já sabe exatamente qual conjunto de funções de validação pertence a qual controle.

### **O Gatilho e o Ciclo de Execução**

Agora que as associações estão feitas, quando os validadores são de fato executados? A validação é disparada por eventos no ciclo de vida do formulário. Os gatilhos mais comuns são:

- **Mudança de Valor:** O usuário digita uma letra no campo de input.
- **Mudança de Status:** Você programaticamente toca (`markAsTouched()`) ou suja (`markAsDirty()`) um campo.
- **Chamada Explícita:** Você chama o método `.updateValueAndValidity()` em um controle.

Quando um desses gatilhos ocorre para um controle específico (vamos usar o `nome` novamente), o Angular inicia seu ciclo de validação para aquele controle:

1. **Identificação:** O Angular identifica que o controle `nome` precisa ser revalidado.
2. **Recuperação:** Ele acessa a instância do controle `nome` e busca aquela lista de funções de validação que ele armazenou anteriormente (`Validators.required`, `Validators.minLength(3)`).
3. **Invocação com Contexto:** Aqui está o passo crucial. O Angular itera sobre essa lista e, para cada função validadora, ele a **invoca**, passando a **própria instância do controle `nome` como o primeiro e único argumento**.

É por isso que a assinatura de qualquer validador síncrono é `(control: AbstractControl): ValidationErrors | null`. É um contrato. O Angular promete: "Quando eu chamar esta função, eu vou te dar o controle que você precisa validar".

Por baixo dos panos, o que o Angular faz é essencialmente isto:

```jsx
// Pseudocódigo do que o Angular faz internamente
const controleNome = this.meuForm.get('nome');
const listaDeValidadoresDoNome = [Validators.required, Validators.minLength(3)];

for (const validador of listaDeValidadoresDoNome) {
  // AQUI! A mágica acontece na chamada da função.
  const resultado = validador(controleNome);
  // ... processa o resultado ...
}

```

Dentro da função `Validators.required`, o parâmetro `control` é uma referência direta para `controleNome`. É por isso que ele pode acessar `controleNome.value` para ver se o valor é vazio.

### **Revisitando o Caso da "Fábrica" (`equalsTo`)**

E como isso se aplica a validadores mais complexos, como uma "fábrica" que retorna outra função? O princípio é o mesmo, mas com um passo intermediário de "construção".

1. **Definição (O Momento da Construção):**
    
    ```tsx
    confirmarEmail: [null, [FormValidations.equalsTo('email')]]
    
    ```
    
    Nesta linha, a função `FormValidations.equalsTo('email')` é **executada imediatamente, uma única vez**. Seu trabalho é construir e retornar a função validadora real, que já "sabe" (graças à *closure*) que precisa se comparar com o campo `'email'`.
    
2. **Associação:**
O Angular pega essa **função interna retornada** e a associa à lista de validadores do controle `confirmarEmail`.
3. **Execução:**
Mais tarde, quando o usuário digita no campo "Confirmar Email", o Angular inicia o ciclo de validação para `confirmarEmail`. Ele pega aquela função interna que foi guardada e a invoca, passando a instância do controle `confirmarEmail` como argumento.

A função, nesse momento, tem tudo o que precisa para trabalhar:

- **`formControl`**: É o controle `confirmarEmail` (passado pelo Angular no momento da execução).
- **`otherField`**: É a string `'email'` (lembrada pela *closure* desde o momento da construção).

### **Conclusão: Uma Analogia Final**

Imagine que você é um gerente (`Angular`) e tem vários funcionários (`FormControl`s).

1. **Definição (Planejamento):** Você escreve as tarefas do dia. Para o funcionário "Carlos" (`nome`), você escreve duas notas: "Verificar se o relatório está preenchido" (`Validators.required`) e "Verificar se o relatório tem mais de 3 páginas" (`Validators.minLength(3)`). Você grampeia essas duas notas na pasta do Carlos.
2. **Execução (O Trabalho):** Chega a hora de avaliar o trabalho do Carlos. Você vai até a mesa dele, pega a pasta, lê a primeira nota ("Verificar se o relatório está preenchido") e diz a ele: "Carlos, execute esta tarefa **no seu próprio relatório**".

O funcionário (o validador) não precisa adivinhar em qual relatório trabalhar. O gerente (Angular) garante que, ao dar a ordem (invocar a função), ele também entrega o objeto exato do trabalho (a instância do `FormControl`). É um sistema simples, explícito e poderoso.