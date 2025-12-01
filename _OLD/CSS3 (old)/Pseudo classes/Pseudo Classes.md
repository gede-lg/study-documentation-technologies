As pseudo-classes em CSS são utilizadas para definir um estado especial de um elemento. Elas permitem estilizar elementos de acordo com o seu estado ou certas características, sem a necessidade de classes ou IDs adicionais no HTML. Abaixo, detalharei cada pseudo-classe mencionada, explicando sua função, como usá-la e fornecendo exemplos de código.

## hover
- **O que é e para que serve:** Utilizada para aplicar um estilo quando o usuário passa o mouse sobre um elemento.
- **Como usar:**
  ```css
  a:hover {
    color: red;
  }
  ```

## active
- **O que é e para que serve:** Aplica estilo ao elemento enquanto ele está sendo ativado pelo usuário (como durante um clique).
- **Como usar:**
  ```css
  a:active {
    color: blue;
  }
  ```

## focus
- **O que é e para que serve:** Usada para estilizar um elemento quando ele está em foco (por exemplo, um campo de input).
- **Como usar:**
  ```css
  input:focus {
    border: 2px solid green;
  }
  ```

## target
- **O que é e para que serve:** Usada para estilizar um elemento que é o alvo de um link de âncora.
- **Como usar:**
  ```css
  #news:target {
    background-color: yellow;
  }
  ```

## enable e disabled
- **O que é e para que serve:** Usadas para estilizar elementos que estão habilitados (`:enabled`) ou desabilitados (`:disabled`).
- **Como usar:**
  ```css
  input:enabled {
    border: 2px solid black;
  }
  input:disabled {
    background-color: lightgray;
  }
  ```

## link e visited
- **O que é e para que serve:** Usadas para estilizar links não visitados (`:link`) e links visitados (`:visited`).
- **Como usar:**
  ```css
  a:link {
    color: blue;
  }
  a:visited {
    color: purple;
  }
  ```

## placeholder-shown
- **O que é e para que serve:** Usada para estilizar campos de input com placeholder visível.
- **Como usar:**
  ```css
  input:placeholder-shown {
    background-color: lightblue;
  }
  ```

## Checked e Indeterminate
- **O que é e para que serve:** `:checked` é usada para estilizar elementos de formulário marcados (como radio e checkboxes), enquanto `:indeterminate` é para checkboxes em um estado indeterminado.
- **Como usar:**
  ```css
  input[type="checkbox"]:checked {
    background-color: green;
  }
  input[type="checkbox"]:indeterminate {
    background-color: orange;
  }
  ```

## valid e invalid, in-range e out-of-range
- **O que é e para que serve:** Usadas para estilizar elementos de formulário com base na validação. `:valid` e `:invalid` para validação geral, `:in-range` e `:out-of-range` para validação de valores numéricos.
- **Como usar:**
  ```css
  input:valid {
    border: 2px solid green;
  }
  input:invalid {
    border: 2px solid red;
  }
  input:in-range {
    background-color: lightgreen;
  }
  input:out-of-range {
    background-color: lightcoral;
  }
  ```

## required e optional
- **O que é e para que serve:** Usadas para estilizar campos de formulário que são obrigatórios (`:required`) ou opcionais (`:optional`).
- **Como usar:**
  ```css
  input:required {
    box-shadow: 0 0 5px red;
  }
  input:optional {
    box-shadow: 0 0 5px green;
  }
  ```

## autofill
- **O que é e para que serve:** Usada para estilizar campos de formulário que são automaticamente preenchidos pelo navegador.
- **Como usar:**
  ```css
  input:-webkit-autofill {
    background-color: yellow;
  }
  ```

## root
- **O que é e para que serve:** Refere-se ao elemento raiz do documento, geralmente o `<html>`. Útil para definir estilos globais.
- **Como usar:**
  ```css
  :root {
    --main-color: blue;
  }
  ```

## nth-child e nth-of-type
- **O que é e para que serve:** Usadas para selecionar elementos com base na sua ordem entre irmãos. `:nth-child` considera todos os tipos de elementos, enquanto `:nth-of-type` considera apenas elementos de um mesmo tipo.
- **Como usar:**
  ```css
  li:nth-child(2) {
    color: red;
  }
  li:nth-of-type(2) {
    color: blue;
  }
  ```

## first-of-type e last-of-type
- **O que é e para que serve:** Selecionam o primeiro e o último elemento de um determinado tipo entre seus irmãos.
- **Como usar:**
  ```css
  p:first-of-type {
    font-weight: bold;
  }
  p:last-of-type {
    font-style: italic;
  }
  ```

## nth-last-child e nth-last-of-type
- **O que é e para que serve:** Semelhantes a `nth-child` e `nth-of-type`, mas contam a partir do último elemento.
- **Como usar:**
  ```css
  li:nth-last-child(2) {
    background-color: lightblue;
  }
  li:nth-last-of-type(2) {
    background-color: lightgreen;
  }
  ```

## only-child e only-of-type
- **O que é e para que serve:** `:only-child` seleciona um elemento que é o único filho dentro de seu pai. `:only-of-type` seleciona um elemento que é o único de seu tipo entre seus irmãos.
- **Como usar:**
  ```css
  p:only-child {
    color: green;
  }
  p:only-of-type {
    color: blue;
  }
  ```

## empty
- **O que é e para que serve:** Seleciona elementos que não têm filhos (incluindo texto).
- **Como usar:**
  ```css
  p:empty {
    display: none;
  }
  ```

## is
- **O que é e para que serve:** Permite selecionar um elemento se ele corresponder a qualquer um dos seletores fornecidos.
- **Como usar:**
  ```css
  :is(header, footer) p {
    color: purple;
  }
  ```

## where
- **O que é e para que

 serve:** Semelhante a `:is`, mas tem especificidade zero, ou seja, não aumenta a especificidade dos seletores.
- **Como usar:**
  ```css
  :where(header, footer) p {
    color: orange;
  }
  ```

## not
- **O que é e para que serve:** Exclui elementos que correspondem ao seletor especificado.
- **Como usar:**
  ```css
  div:not(.class) {
    border: 1px solid black;
  }
  ```

## has
- **O que é e para que serve:** Seleciona um elemento se ele contém outro elemento especificado.
- **Como usar:**
  ```css
  p:has(> span) {
    color: red;
  }
  ```

Estas pseudo-classes permitem uma grande variedade de estilizações baseadas no estado do documento e dos elementos, sem a necessidade de JavaScript ou alterações no HTML. Elas são fundamentais para a criação de interfaces dinâmicas e interativas.