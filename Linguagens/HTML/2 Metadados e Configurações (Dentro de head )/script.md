## 1. Introdução

A tag `<script>` é essencial no HTML5 para incluir e executar scripts, geralmente escritos em JavaScript, dentro de uma página web. Sua principal função é adicionar interatividade, manipular elementos do DOM (Document Object Model), validar formulários, entre outras funcionalidades essenciais para aplicações web dinâmicas.

---

## 2. Sumário

1. Introdução
2. Definição e Conceitos Fundamentais
3. Sintaxe e Estrutura
4. Componentes Principais
5. Atributos da Tag `<script>`
6. Uso Avançado
7. Exemplos Práticos
8. Informações Adicionais
9. Referências para Estudo

---

## 3. Definição e Conceitos Fundamentais

A tag `<script>` permite a inclusão de códigos JavaScript no HTML. Pode ser usada de três formas principais:

1. **Internamente**: O código é inserido diretamente dentro da tag `<script>`.
2. **Externamente**: O código é armazenado em um arquivo separado e referenciado com o atributo `src`.
3. **Inline (diretamente em elementos HTML)**: JavaScript é colocado dentro de atributos como `onclick`, `onchange`, entre outros.

---

## 4. Sintaxe e Estrutura

A estrutura da tag `<script>` pode variar de acordo com o tipo de implementação.

### 4.1 Exemplo de script interno

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <title>Exemplo de Script Interno</title>
</head>
<body>
    <script>
        console.log("Olá, mundo!");
    </script>
</body>
</html>

```

### 4.2 Exemplo de script externo

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <title>Exemplo de Script Externo</title>
    <script src="script.js"></script>
</head>
<body>
</body>
</html>

```

Arquivo `script.js`:

```
console.log("Olá, mundo!");

```

---

## 5. Componentes Principais

### 5.1 Elemento `<script>`

A tag `<script>` encapsula o código JavaScript dentro de uma página HTML.

### 5.2 Localização do `<script>`

Pode ser colocado no `<head>` ou antes do fechamento do `<body>`. O local influencia o desempenho da página.

---

## 6. Atributos da Tag `<script>`

| Atributo | Descrição |
| --- | --- |
| `src` | Define o caminho para um arquivo JavaScript externo. |
| `type` | Especifica o tipo do script (por padrão, `text/javascript`). |
| `async` | Indica que o script deve ser carregado de forma assíncrona. |
| `defer` | Faz com que o script seja carregado após o carregamento do HTML. |
| `nomodule` | Faz com que o script seja ignorado em navegadores que suportam ES6 modules. |

---

## 7. Uso Avançado

### 7.1 Carregamento assíncrono e deferido

```html
<script src="script.js" async></script>
<script src="script.js" defer></script>

```

- **`async`**: O script é carregado e executado de forma assíncrona, sem bloquear a renderização da página.
- **`defer`**: O script é carregado em paralelo, mas executado somente após a página ser carregada.

### 7.2 Módulos ES6

```html
<script type="module">
    import { minhaFuncao } from './modulo.js';
    minhaFuncao();
</script>

```

---

## 8. Exemplos Práticos

### 8.1 Manipulação do DOM

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <title>Manipulação do DOM</title>
</head>
<body>
    <button id="meuBotao">Clique aqui</button>
    <script>
        document.getElementById("meuBotao").addEventListener("click", function() {
            alert("Botão clicado!");
        });
    </script>
</body>
</html>

```

### 8.2 Requisição Fetch API

```html
<script>
    fetch('https://api.exemplo.com/dados')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Erro:', error));
</script>

```

---

## 9. Informações Adicionais

- A inclusão de scripts no final do `<body>` melhora a performance.
- Prefira scripts externos para reutilização e manutenção do código.
- Sempre valide e sanitize entradas do usuário para evitar ataques como XSS (Cross-Site Scripting).
- Utilize a consola do navegador para depuração de erros.

---

## 10. Referências para Estudo

- [MDN Web Docs - `<script>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/script)
- [W3Schools - HTML `<script>`](https://www.w3schools.com/tags/tag_script.asp)
- [JavaScript.info - Scripts](https://javascript.info/script)

---

Este documento fornece uma visão abrangente sobre a tag `<script>` no HTML5, desde o uso básico até técnicas avançadas. Esperamos que ajude no entendimento e prática com JavaScript no desenvolvimento web!