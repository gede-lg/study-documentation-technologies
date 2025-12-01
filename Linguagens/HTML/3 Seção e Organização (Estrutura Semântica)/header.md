## 1. Introdução

A tag `<header>` é um elemento semântico do HTML5 que representa uma área introdutória ou um bloco de cabeçalho de uma seção ou de uma página. Ela melhora a acessibilidade e organização do conteúdo, facilitando a interpretação pelos motores de busca e leitores de tela.

## 2. Sumário

1. Introdução
2. Definição e conceitos fundamentais
3. Sintaxe e estrutura
4. Componentes principais
5. Propriedades e atributos
6. Uso avançado
7. Exemplos práticos
8. Informações adicionais
9. Referências para estudo

## 3. Definição e conceitos fundamentais

A tag `<header>` é utilizada para definir um cabeçalho em um documento HTML. Ela pode conter títulos, logotipos, menus de navegação e outros elementos introdutórios. Diferente da tag `<head>`, que armazena metadados, `<header>` foca em apresentação de informações ao usuário.

**Principais conceitos:**

- Pode aparecer múltiplas vezes na página.
- É semântica, tornando o código mais legível.
- Não deve ser usada dentro da `<footer>` ou `<address>`.

## 4. Sintaxe e estrutura

A tag `<header>` é escrita da seguinte forma:

```html
<header>
    <h1>Título Principal</h1>
    <nav>
        <ul>
            <li><a href="#">Início</a></li>
            <li><a href="#">Sobre</a></li>
            <li><a href="#">Contato</a></li>
        </ul>
    </nav>
</header>

```

## 5. Componentes principais

Dentro de `<header>`, podem ser incluídos:

- **Títulos (`<h1>` a `<h6>`)**: Definem o título principal.
- **Elementos de navegação (`<nav>`)**: Contêm links para outras partes do site.
- **Imagens e logotipos (`<img>`)**: Representam a identidade visual.
- **Botões ou formulários de busca**: Melhoram a usabilidade.

## 6. Propriedades e atributos

A tag `<header>` não possui atributos específicos, mas pode utilizar atributos globais como:

- `id`: Identifica o elemento de forma única.
- `class`: Define classes para estilização via CSS.
- `style`: Aplica estilos inline.
- `role`: Indica funções semânticas para acessibilidade.

## 7. Uso avançado

A tag `<header>` pode ser combinada com CSS e JavaScript para criar experiências dinâmicas.

### Exemplo de cabeçalho fixo

```html
<header class="header-fixed">
    <h1>Meu Site</h1>
    <nav>
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Serviços</a></li>
            <li><a href="#">Contato</a></li>
        </ul>
    </nav>
</header>
<style>
    .header-fixed {
        position: fixed;
        top: 0;
        width: 100%;
        background: #333;
        color: white;
        padding: 10px;
        text-align: center;
    }
</style>

```

## 8. Exemplos práticos

### 8.1. Exemplo de cabeçalho responsivo

```html
<header>
    <img src="logo.png" alt="Logotipo">
    <h1>Bem-vindo ao Site</h1>
    <nav>
        <button id="menu-toggle">Menu</button>
        <ul id="menu">
            <li><a href="#">Home</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contato</a></li>
        </ul>
    </nav>
</header>
<script>
    document.getElementById("menu-toggle").addEventListener("click", function() {
        document.getElementById("menu").classList.toggle("show");
    });
</script>
<style>
    #menu {
        display: none;
    }
    .show {
        display: block;
    }
</style>

```

### 8.2. Cabeçalho animado ao rolar a página

```html
<header id="animated-header">
    <h1>Meu Site</h1>
</header>
<script>
    window.addEventListener("scroll", function() {
        document.getElementById("animated-header").style.opacity = 1 - window.scrollY / 500;
    });
</script>
<style>
    #animated-header {
        position: fixed;
        top: 0;
        width: 100%;
        background: black;
        color: white;
        padding: 20px;
        text-align: center;
    }
</style>

```

## 9. Informações adicionais

- A tag `<header>` não substitui a necessidade de `<h1>`, pois não possui hierarquia de título.
- Diferente da `<nav>`, que é específica para navegação, `<header>` é mais abrangente.
- Pode ser usada em artigos e seções dentro da página.

## 10. Referências para estudo

- [MDN Web Docs - `<header>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header)
- [W3Schools - `<header>`](https://www.w3schools.com/tags/tag_header.asp)
- [HTML5 Specification](https://html.spec.whatwg.org/)

Este documento fornece uma abordagem completa sobre a tag `<header>` em HTML5, com exemplos práticos e conceitos avançados.