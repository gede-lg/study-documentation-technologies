# Grade Curricular - v2

Esta página apresenta um roteiro de estudo de HTML5 e exemplos de código para cada tag, divididos por categorias.

## 1) Estrutura de Documento

| Tag               | Descrição                                                   | Exemplo de Código                                                     |
| ----------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| `<!DOCTYPE html>` | Declaração do tipo de documento (HTML5).                    | `<!DOCTYPE html>`                                                     |
| `<html>`          | Elemento raiz do documento. Pode conter `lang` para idioma. | `<html lang="pt-BR"></html>` \|                                       |
| `<head>`          | Contém metadados, título, links para CSS/JS, etc.           | `<head><meta charset="UTF-8"><br>  <title>Exemplo</title><br></head>` |

| `<body>` | Conteúdo visível/interativo da página. | `<body>
  <p>Conteúdo aqui</p>
</body>` |

## 2) Metadados e Configurações (dentro de <head>)

| Tag | Descrição | Exemplo de Código |
| --- | --- | --- |
| `<title>` | Título da página (aparece na aba do navegador). | `<title>Minha Página HTML</title>` |
| `<base>` | Define URL base para links relativos. | `<base href="https://www.meusite.com/">` |
| `<link>` | Importa recursos externos (CSS, ícones, etc.). | `<link rel="stylesheet" href="style.css">` |
| `<meta>` | Metadados (charset, descrição, viewport...). | `<meta charset="UTF-8">
<meta name="description" content="Descrição do site">` |
| `<style>` | CSS embutido (não recomendado para produção, mas possível). | `<style>
  body {
    background: #f9f9f9;
  }
</style>` |
| `<script>` | Inclui JavaScript (interno ou externo). | `<script>
  console.log('Hello World');
</script>

<script src="app.js" defer></script>` |
| `<noscript>` | Conteúdo exibido se JS estiver desativado. | `<noscript>
  Seu navegador não suporta JavaScript.
</noscript>` |

## 3) Elementos de Seção e Organização

| Tag | Descrição | Exemplo |
| --- | --- | --- |
| `<header>` | Cabeçalho de página ou seção (logo, título, menu). | `<header>
  <h1>Bem-vindo!</h1>
  <nav>...</nav>
</header>` |
| `<nav>` | Seção de navegação (links principais). | `<nav>
  <ul>
    <li><a href="#">Home</a></li>
    <li><a href="#">Contato</a></li>
  </ul>
</nav>` |
| `<main>` | Conteúdo principal (apenas 1 por página). | `<main>
  <h2>Artigos em Destaque</h2>
  ...
</main>` |
| `<section>` | Seção temática, pode conter títulos, artigos, etc. | `<section>
  <h2>Seção 1</h2>
  <p>Texto...</p>
</section>` |
| `<article>` | Conteúdo independente (ex.: post de blog). | `<article>
  <h3>Título do Artigo</h3>
  <p>Conteúdo do artigo...</p>
</article>` |
| `<aside>` | Conteúdo lateral, como anúncios ou complementos. | `<aside>
  <h4>Links Patrocinados</h4>
  <ul>...</ul>
</aside>` |
| `<footer>` | Rodapé de página ou seção (créditos, links de rodapé). | `<footer>
  <p>© 2025 - Meu Site</p>
</footer>` |
| `<address>` | Informações de contato ou endereço (autor). Pode aparecer em rodapés. | `<address>
  Autor: <a href="mailto:exemplo@exemplo.com">Fulano</a>
  <br>Rua X, 123 - SP
</address>` |
| `<div>` | Contêiner genérico (sem significado semântico). | `<div class="container">
  <p>Conteúdo agrupado.</p>
</div>` |

## 4) Agrupamento e Texto

### 4.1) Blocos de Texto

| Tag | Descrição | Exemplo |
| --- | --- | --- |
| `<p>` | Parágrafo de texto. | `<p>Este é um parágrafo.</p>` |
| `<h1> ... <h6>` | Títulos (hierarquia de 1 a 6). | `<h1>Título 1</h1>
<h2>Título 2</h2>` |
| `<hr>` | Linha temática (separador). | `<hr>` |
| `<pre>` | Texto pré-formatado (mantém espaços e quebras). | `<pre>
Linha 1
   Linha 2 (com espaços)
</pre>` |
| `<blockquote>` | Citação em bloco. | `<blockquote cite="https://exemplo.com">
  Texto citado...
</blockquote>` |
| `<ol>`, `<ul>`, `<li>` | Listas ordenadas (`<ol>`) ou não (`<ul>`) e itens (`<li>`). | `<ol>
  <li>Item 1</li>
  <li>Item 2</li>
</ol>

<ul>
  <li>Item A</li>
  <li>Item B</li>
</ul>` |
| `<dl>`, `<dt>`, `<dd>` | Lista de descrição (termos e definições). | `<dl>
  <dt>HTML</dt>
  <dd>Linguagem de marcação</dd>
</dl>` |

### 4.2) Elementos Inline (Texto em linha)

| Tag | Descrição | Exemplo |
| --- | --- | --- |
| `<a>` | Hiperlink. | `<a href="https://exemplo.com" target="_blank">Visitar</a>` |
| `<em>`, `<strong>` | Ênfase (`<em>`) e destaque (`<strong>`). | `<p>Use <em>ênfase</em> e <strong>destaque</strong>.</p>` |
| `<small>`, `<s>`, `<cite>`, `<q>` | Pequeno, tachado, citação de referência, citação curta. | `<small>Texto menor</small>
<s>Texto tachado</s>
<cite>Título de Obra</cite>
<q>Citação curta</q>` |
| `<abbr>` | Abreviação (com `title` explicando). | `<abbr title="Hypertext Markup Language">HTML</abbr>` |
| `<dfn>` | Marca a definição de um termo. | `<p>O <dfn>HTML</dfn> é uma linguagem de marcação...</p>` |
| `<i>`, `<b>`, `<u>`, `<mark>` | Itálico, negrito, sublinhado, texto destacado. | `<i>Texto itálico</i>
<b>Texto negrito</b>
<u>Texto sublinhado</u>
<mark>Texto destacado</mark>` |
| `<span>` | Contêiner em linha genérico. | `<span class="enfatizar">Texto em linha</span>` |
| `<br>` | Quebra de linha. | `Texto linha 1<br>Texto linha 2` |
| `<wbr>` | Ponto de possível quebra de palavra. | `Supercalifra<wbr>gilistic` |
| `<bdi>`, `<bdo>` | Isola ou define direcionalidade do texto (ex.: RTL). | `<bdo dir="rtl">Texto invertido</bdo>
<bdi dir="rtl">Exemplo</bdi>` |
| `<time>` | Representa data/hora (legível por máquinas). | `<time datetime="2025-02-06">06/02/2025</time>` |
| `<var>`, `<samp>`, `<kbd>`, `<code>` | Representam variável, saída de computador, entrada de teclado e código fonte. | `<p>Digite <kbd>Ctrl + C</kbd>.</p>
<code>console.log('Hello')</code>
<var>x</var> = 10
<samp>Output: 42</samp>` |
| `<sub>`, `<sup>` | Subscrito e sobrescrito (química, matemática). | `H<sub>2</sub>O e E=mc<sup>2</sup>` |
| `<ruby>`, `<rt>`, `<rp>`, `<rtc>` | Anotações fonéticas ou de pronúncia (principalmente para idiomas asiáticos). | `<ruby>漢<rt>hàn</rt></ruby>` |
| `<data>` | Associa conteúdo legível a valor de máquina. | `<data value="1234">Produto #1234</data>` |

### 4.3) Marcação de Edição

| Tag | Descrição | Exemplo |
| --- | --- | --- |
| `<ins>` | Texto inserido (destacado, geralmente sublinhado). | `<ins>Texto inserido</ins>` |
| `<del>` | Texto removido (geralmente tachado). | `<del>Texto removido</del>` |

## 5) Tabelas (Tabular Data)

| Tag | Descrição | Exemplo |
| --- | --- | --- |
| `<table>` | Define a tabela. | `<table>...</table>` |
| `<caption>` | Título/legenda da tabela. | `<table>
  <caption>Minha Tabela</caption>
</table>` |
| `<colgroup>`, `<col>` | Agrupa/define propriedades para colunas. | `<table>
  <colgroup>
    <col style="background:#f0f0f0">
    <col style="background:#fff">
  </colgroup>
</table>` |
| `<thead>`, `<tbody>`, `<tfoot>` | Cabeçalho, corpo e rodapé da tabela. | `<table>
  <thead>...</thead>
  <tbody>...</tbody>
  <tfoot>...</tfoot>
</table>` |
| `<tr>` | Linha da tabela. | `<tr><td>Célula</td><td>Célula</td></tr>` |
| `<th>`, `<td>` | Célula de cabeçalho e célula de dados. | `<tr>
  <th>Título Coluna</th>
  <td>Dado</td>
</tr>` |

## 6) Mídia e Conteúdo Avançado

| Tag | Descrição | Exemplo |
| --- | --- | --- |
| `<img>` | Exibe uma imagem; atributo `alt` é fundamental. | `<img src="exemplo.png" alt="Descrição da imagem">` |
| `<figure>`, `<figcaption>` | Agrupa imagem (ou outra mídia) e legenda. | `<figure>
  <img src="img.png" alt="Exemplo">
  <figcaption>Legenda da figura</figcaption>
</figure>` |
| `<picture>`, `<source>` | Imagens responsivas (vários formatos/resoluções). | `<picture>
  <source srcset="img-small.jpg" media="(max-width:600px)">
  <source srcset="img-large.jpg" media="(min-width:601px)">
  <img src="img-default.jpg" alt="Imagem Responsiva">
</picture>` |
| `<map>`, `<area>` | Mapa de imagem (regiões clicáveis). | `<img src="mapa.png" usemap="#meumapa" alt="Mapa">
<map name="meumapa">
  <area shape="rect" coords="0,0,50,50" href="#" alt="Retangulo">
</map>` |
| `<video>`, `<audio>`, `<track>` | Vídeo, áudio e legendas/legenda oculta. | `<video width="320" controls>
  <source src="video.mp4" type="video/mp4">
  <track src="legenda.vtt" kind="subtitles" srclang="pt" label="Português">
</video>

<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
</audio>` |
| `<canvas>` | Área de desenho manipulável via JS (gráficos 2D/3D). | `<canvas id="meuCanvas" width="200" height="100">
Seu navegador não suporta canvas
</canvas>` |

## 7) Conteúdo Incorporado

| Tag | Descrição | Exemplo |
| --- | --- | --- |
| `<iframe>` | Incorpora outra página HTML. | `<iframe src="https://exemplo.com" width="400" height="300"></iframe>` |
| `<embed>` | Incorpora recursos externos (PDF, plugins). | `<embed src="exemplo.pdf" type="application/pdf" width="400" height="300">` |
| `<object>`, `<param>` | Conteúdo externo (substituído com frequência por `<embed>`). | `<object data="exemplo.pdf" type="application/pdf" width="400" height="300">
  <param name="paramEx" value="valor">
  Conteúdo alternativo se não carregar
</object>` |

## 8) Formulários e Controle de Dados

| Tag | Descrição | Exemplo |
| --- | --- | --- |
| `<form>` | Define o formulário. `action`, `method`, etc. | `<form action="/enviar" method="post">
  ...
</form>` |
| `<label>` | Rótulo para campo de formulário (associado via `for` e `id`). | `<label for="nome">Nome:</label>
<input type="text" id="nome" name="nome">` |
| `<input>` | Campo de entrada (tipos: `text`, `email`, `radio`, etc.). | `<input type="text" name="usuario">
<input type="email" name="email">
<input type="radio" name="opcao" value="1">` |
| `<button>` | Botão (`submit`, `reset`, `button`). | `<button type="submit">Enviar</button>` |
| `<select>`, `<option>`, `<optgroup>` | Lista suspensa (dropdown). | `<select name="opcoes">
  <optgroup label="Grupo 1">
    <option>Item 1</option>
    <option>Item 2</option>
  </optgroup>
</select>` |
| `<textarea>` | Campo de texto multilinha. | `<textarea name="mensagem" rows="4" cols="50"></textarea>` |
| `<fieldset>`, `<legend>` | Agrupamento de campos com legenda. | `<fieldset>
  <legend>Dados Pessoais</legend>
  <label>Nome: </label> <input type="text">
</fieldset>` |
| `<datalist>` | Lista de opções para auto-complete em `<input>`. | `<input list="linguagens" name="linguagem">
<datalist id="linguagens">
  <option value="HTML">
  <option value="CSS">
</datalist>` |
| `<output>` | Exibe resultado de cálculo ou script. | `<output name="resultado">0</output>` |
| `<progress>` | Barra de progresso. | `<progress value="30" max="100">30%</progress>` |
| `<meter>` | Indica medição em um intervalo (ex.: bateria). | `<meter value="2" min="0" max="10">2 de 10</meter>` |

## 9) Elementos Interativos

| Tag | Descrição | Exemplo |
| --- | --- | --- |
| `<details>`, `<summary>` | Bloco de conteúdo expansível/colapsável. | `<details>
  <summary>Clique para expandir</summary>
  <p>Texto escondido...</p>
</details>` |
| `<dialog>` | Caixa de diálogo nativa (modal). | `<dialog id="meuDialog">
  <p>Conteúdo do diálogo</p>
  <button onclick="this.closest('dialog').close()">Fechar</button>
</dialog>
<button onclick="document.getElementById('meuDialog').showModal()">Abrir</button>` |
| `<menu>` | Lista de comandos/opções (pouco utilizada). | `<menu>
  <li><a href="#">Item 1</a></li>
  <li><a href="#">Item 2</a></li>
</menu>` |
| `<template>` | Fragmento de HTML não renderizado até ser manipulado por JS. | `<template id="tmpl">
  <p>Texto dentro do template</p>
</template>

<script>
  const temp = document.getElementById('tmpl');
  const clone = temp.content.cloneNode(true);
  document.body.appendChild(clone);
</script>` |
| `<slot>` | Espaço reservado em Web Components (Shadow DOM). | `<!-- Usado dentro de um Web Component -->
<slot name="conteudo">Fallback</slot>` |

## 10) Atributos Globais e `data-*`

Todos os elementos HTML podem ter atributos globais, como `id`, `class`, `style`, `title`, `tabindex`, `lang`, `dir`, `hidden`, `draggable`, `data-*`, etc.

| Atributo | Descrição | Exemplo |
| --- | --- | --- |
| `id`, `class` | Identificação única (`id`) e classes (`class`) para estilização/seletores JS. | `<div id="principal" class="container">...</div>` |
| `style` | CSS inline no próprio elemento. | `<p style="color:red;">Texto Vermelho</p>` |
| `title` | Texto de dica (tooltip) ao passar o mouse. | `<span title="Dica">Passe o mouse aqui</span>` |
| `lang`, `dir` | Especifica idioma e direção de texto (ex.: `dir="rtl"`). | `<p lang="en" dir="ltr">Hello</p>` |
| `hidden` | Oculta o elemento sem removê-lo do DOM. | `<div hidden>Não aparece</div>` |
| `data-*` | Atributos de dados personalizados. | `<div data-produto-id="1234" data-preco="10.99"></div>
<script>
  const div = document.querySelector('[data-produto-id]');
  console.log(div.dataset.preco);
</script>` |

## 11) Tags Obsoletas (Evitar Uso)

Estas tags não devem ser usadas em projetos modernos. Elas aparecem em códigos antigos ou não são padrões oficiais do HTML5.

| Tag | Motivo | Exemplo (Não utilizar!) |
| --- | --- | --- |
| `<font>` | Estilização deve ser feita via CSS. | `<font color="red">Texto</font>` |
| `<center>` | Para centralizar, use `text-align: center` no CSS. | `<center>Texto</center>` |
| `<marquee>` | Nunca foi padrão oficial, comportamento não confiável. | `<marquee>Texto rolando</marquee>` |
| `<big>`, `<strike>`, `<tt>`, etc. | Substituídas por CSS ou tags semânticas adequadas. | `<big>Texto grande</big>
<strike>Texto tachado</strike>` |
| `<frameset>`, `<frame>`, `<noframes>` | Antigo sistema de “molduras” para layout, obsoleto no HTML5. | `<frameset cols="50%,50%">
  <frame src="left.html">
  <frame src="right.html">
</frameset>` |

---

**Conclusão:** Esta grade curricular abrange praticamente todas as tags do HTML5, com pequenos exemplos de cada. Lembre-se de focar em *boas práticas*, *semântica*, e *acessibilidade* no uso de cada elemento.

[Código](Código.md)