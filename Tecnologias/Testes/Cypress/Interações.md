## O que são e para que servem?

As interações no Cypress são usadas para simular ações que um usuário realizaria em uma aplicação web. Isso inclui clicar em botões, preencher formulários, navegar entre páginas, entre outros. Essas interações são fundamentais para testar se a aplicação se comporta como esperado quando submetida a ações de um usuário real.

## Lista de 10 Interações Comuns no Cypress:

1. **`click()`**
   - **Uso**: Clica em um elemento.
   - **Exemplo**:
     ```javascript
     cy.get('button').click();
     ```

2. **`type()`**
   - **Uso**: Digita texto em um campo de entrada (input).
   - **Exemplo**:
     ```javascript
     cy.get('input').type('Texto de exemplo');
     ```

3. **`check()`**
   - **Uso**: Marca uma caixa de seleção (checkbox) ou um botão de opção (radio button).
   - **Exemplo**:
     ```javascript
     cy.get('[type="checkbox"]').check();
     ```

4. **`uncheck()`**
   - **Uso**: Desmarca uma caixa de seleção.
   - **Exemplo**:
     ```javascript
     cy.get('[type="checkbox"]').uncheck();
     ```

5. **`select()`**
   - **Uso**: Seleciona uma opção em um menu suspenso (dropdown).
   - **Exemplo**:
     ```javascript
     cy.get('select').select('Opção 1');
     ```

6. **`trigger()`**
   - **Uso**: Dispara um evento em um elemento.
   - **Exemplo**:
     ```javascript
     cy.get('button').trigger('mouseover');
     ```

7. **`focus()`**
   - **Uso**: Coloca o foco em um elemento.
   - **Exemplo**:
     ```javascript
     cy.get('input').focus();
     ```

8. **`blur()`**
   - **Uso**: Remove o foco de um elemento.
   - **Exemplo**:
     ```javascript
     cy.get('input').blur();
     ```

9. **`submit()`**
   - **Uso**: Envia um formulário.
   - **Exemplo**:
     ```javascript
     cy.get('form').submit();
     ```

10. **`scrollTo()`**
    - **Uso**: Rola a página ou um elemento até uma posição específica.
    - **Exemplo**:
      ```javascript
      cy.scrollTo('bottom');
      ```

## Observações Adicionais:

- **Encadeamento de Comandos**: Cypress permite o encadeamento de comandos para realizar várias ações em sequência. Por exemplo:
  ```javascript
  cy.get('input').type('Texto').clear().type('Novo texto');
  ```

- **Espera Implícita**: Cypress gerencia automaticamente as esperas, aguardando elementos estarem disponíveis para interação, o que torna os testes mais robustos.

- **Assertivas**: Interações frequentemente são seguidas por assertivas para verificar se o resultado esperado foi alcançado. Por exemplo:
  ```javascript
  cy.get('input').type('Texto').should('have.value', 'Texto');
  ```

- **Customização**: Cypress permite customizar o comportamento padrão das interações, como alterar a velocidade da digitação, escolher um botão específico do mouse para o clique, entre outros.

- **Debugging**: Cypress oferece excelentes ferramentas de debugging, como a capacidade de inspecionar o estado da aplicação em qualquer ponto do teste.

O uso eficiente das interações no Cypress é crucial para simular com precisão o comportamento do usuário e garantir que a aplicação funcione como esperado sob diferentes cenários de uso.