# Código

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Grade Curricular HTML5 - Todas as Tags</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 1em;
    }
    h1, h2 {
      margin-top: 1em;
      color: #333;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1em;
    }
    th, td {
      border: 1px solid #999;
      padding: 0.5em;
      vertical-align: top;
    }
    th {
      background: #f0f0f0;
    }
    code {
      background: #f9f9f9;
      display: inline-block;
      padding: 0.2em;
    }
    pre {
      background: #f9f9f9;
      padding: 0.5em;
      margin: 0;
      overflow-x: auto;
      font-size: 0.95em;
    }
    .snippet {
      background: #f9f9f9;
      padding: 0.5em;
      margin: 0;
      font-size: 0.9em;
      display: block;
      white-space: pre;
      border: 1px solid #ddd;
    }
  </style>
</head>
<body>

  <h1>Grade Curricular HTML5 - Tags e Exemplos</h1>
  <p>Esta página apresenta um roteiro de estudo de HTML5 e exemplos de código para cada tag, divididos por categorias.</p>

  <!-- ==================================
       1) ESTRUTURA DE DOCUMENTO
       ================================== -->
  <h2>1) Estrutura de Documento</h2>
  <table>
    <thead>
      <tr>
        <th>Tag</th>
        <th>Descrição</th>
        <th>Exemplo de Código</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&lt;!DOCTYPE html&gt;</code></td>
        <td>Declaração do tipo de documento (HTML5).</td>
        <td>
          <pre class="snippet">&lt;!DOCTYPE html&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;html&gt;</code></td>
        <td>Elemento raiz do documento. Pode conter <code>lang</code> para idioma.</td>
        <td>
          <pre class="snippet">&lt;html lang="pt-BR"&gt;
  ...
&lt;/html&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;head&gt;</code></td>
        <td>Contém metadados, título, links para CSS/JS, etc.</td>
        <td>
          <pre class="snippet">&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;Exemplo&lt;/title&gt;
&lt;/head&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;body&gt;</code></td>
        <td>Conteúdo visível/interativo da página.</td>
        <td>
          <pre class="snippet">&lt;body&gt;
  &lt;p&gt;Conteúdo aqui&lt;/p&gt;
&lt;/body&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ==================================
       2) METADADOS E CONFIGURAÇÕES
       ================================== -->
  <h2>2) Metadados e Configurações (dentro de &lt;head&gt;)</h2>
  <table>
    <thead>
      <tr>
        <th>Tag</th>
        <th>Descrição</th>
        <th>Exemplo de Código</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&lt;title&gt;</code></td>
        <td>Título da página (aparece na aba do navegador).</td>
        <td>
          <pre class="snippet">&lt;title&gt;Minha Página HTML&lt;/title&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;base&gt;</code></td>
        <td>Define URL base para links relativos.</td>
        <td>
          <pre class="snippet">&lt;base href="https://www.meusite.com/"&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;link&gt;</code></td>
        <td>Importa recursos externos (CSS, ícones, etc.).</td>
        <td>
          <pre class="snippet">&lt;link rel="stylesheet" href="style.css"&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;meta&gt;</code></td>
        <td>Metadados (charset, descrição, viewport...).</td>
        <td>
          <pre class="snippet">&lt;meta charset="UTF-8"&gt;
&lt;meta name="description" content="Descrição do site"&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;style&gt;</code></td>
        <td>CSS embutido (não recomendado para produção, mas possível).</td>
        <td>
          <pre class="snippet">&lt;style&gt;
  body {
    background: #f9f9f9;
  }
&lt;/style&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;script&gt;</code></td>
        <td>Inclui JavaScript (interno ou externo).</td>
        <td>
          <pre class="snippet">&lt;script&gt;
  console.log('Hello World');
&lt;/script&gt;

&lt;script src="app.js" defer&gt;&lt;/script&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;noscript&gt;</code></td>
        <td>Conteúdo exibido se JS estiver desativado.</td>
        <td>
          <pre class="snippet">&lt;noscript&gt;
  Seu navegador não suporta JavaScript.
&lt;/noscript&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ==================================
       3) ELEMENTOS DE SEÇÃO / ORGANIZAÇÃO
       ================================== -->
  <h2>3) Elementos de Seção e Organização</h2>
  <table>
    <thead>
      <tr>
        <th>Tag</th>
        <th>Descrição</th>
        <th>Exemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&lt;header&gt;</code></td>
        <td>Cabeçalho de página ou seção (logo, título, menu).</td>
        <td>
          <pre class="snippet">&lt;header&gt;
  &lt;h1&gt;Bem-vindo!&lt;/h1&gt;
  &lt;nav&gt;...&lt;/nav&gt;
&lt;/header&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;nav&gt;</code></td>
        <td>Seção de navegação (links principais).</td>
        <td>
          <pre class="snippet">&lt;nav&gt;
  &lt;ul&gt;
    &lt;li&gt;&lt;a href="#"&gt;Home&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#"&gt;Contato&lt;/a&gt;&lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;main&gt;</code></td>
        <td>Conteúdo principal (apenas 1 por página).</td>
        <td>
          <pre class="snippet">&lt;main&gt;
  &lt;h2&gt;Artigos em Destaque&lt;/h2&gt;
  ...
&lt;/main&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;section&gt;</code></td>
        <td>Seção temática, pode conter títulos, artigos, etc.</td>
        <td>
          <pre class="snippet">&lt;section&gt;
  &lt;h2&gt;Seção 1&lt;/h2&gt;
  &lt;p&gt;Texto...&lt;/p&gt;
&lt;/section&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;article&gt;</code></td>
        <td>Conteúdo independente (ex.: post de blog).</td>
        <td>
          <pre class="snippet">&lt;article&gt;
  &lt;h3&gt;Título do Artigo&lt;/h3&gt;
  &lt;p&gt;Conteúdo do artigo...&lt;/p&gt;
&lt;/article&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;aside&gt;</code></td>
        <td>Conteúdo lateral, como anúncios ou complementos.</td>
        <td>
          <pre class="snippet">&lt;aside&gt;
  &lt;h4&gt;Links Patrocinados&lt;/h4&gt;
  &lt;ul&gt;...&lt;/ul&gt;
&lt;/aside&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;footer&gt;</code></td>
        <td>Rodapé de página ou seção (créditos, links de rodapé).</td>
        <td>
          <pre class="snippet">&lt;footer&gt;
  &lt;p&gt;&copy; 2025 - Meu Site&lt;/p&gt;
&lt;/footer&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;address&gt;</code></td>
        <td>Informações de contato ou endereço (autor). Pode aparecer em rodapés.</td>
        <td>
          <pre class="snippet">&lt;address&gt;
  Autor: &lt;a href="mailto:exemplo@exemplo.com"&gt;Fulano&lt;/a&gt;
  &lt;br&gt;Rua X, 123 - SP
&lt;/address&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;div&gt;</code></td>
        <td>Contêiner genérico (sem significado semântico).</td>
        <td>
          <pre class="snippet">&lt;div class="container"&gt;
  &lt;p&gt;Conteúdo agrupado.&lt;/p&gt;
&lt;/div&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ==================================
       4) AGRUPAMENTO E TEXTO
       ================================== -->
  <h2>4) Agrupamento e Texto</h2>
  <h3>4.1) Blocos de Texto</h3>
  <table>
    <thead>
      <tr>
        <th>Tag</th>
        <th>Descrição</th>
        <th>Exemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&lt;p&gt;</code></td>
        <td>Parágrafo de texto.</td>
        <td>
          <pre class="snippet">&lt;p&gt;Este é um parágrafo.&lt;/p&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;h1&gt; ... &lt;h6&gt;</code></td>
        <td>Títulos (hierarquia de 1 a 6).</td>
        <td>
          <pre class="snippet">&lt;h1&gt;Título 1&lt;/h1&gt;
&lt;h2&gt;Título 2&lt;/h2&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;hr&gt;</code></td>
        <td>Linha temática (separador).</td>
        <td>
          <pre class="snippet">&lt;hr&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;pre&gt;</code></td>
        <td>Texto pré-formatado (mantém espaços e quebras).</td>
        <td>
          <pre class="snippet">&lt;pre&gt;
Linha 1
   Linha 2 (com espaços)
&lt;/pre&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;blockquote&gt;</code></td>
        <td>Citação em bloco.</td>
        <td>
          <pre class="snippet">&lt;blockquote cite="https://exemplo.com"&gt;
  Texto citado...
&lt;/blockquote&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;ol&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;li&gt;</code></td>
        <td>Listas ordenadas (<code>&lt;ol&gt;</code>) ou não (<code>&lt;ul&gt;</code>) e itens (<code>&lt;li&gt;</code>).</td>
        <td>
          <pre class="snippet">&lt;ol&gt;
  &lt;li&gt;Item 1&lt;/li&gt;
  &lt;li&gt;Item 2&lt;/li&gt;
&lt;/ol&gt;

&lt;ul&gt;
  &lt;li&gt;Item A&lt;/li&gt;
  &lt;li&gt;Item B&lt;/li&gt;
&lt;/ul&gt;</pre>
        </td>
      </tr>
      <tr>
        <td>
          <code>&lt;dl&gt;</code>, <code>&lt;dt&gt;</code>, <code>&lt;dd&gt;</code>
        </td>
        <td>Lista de descrição (termos e definições).</td>
        <td>
          <pre class="snippet">&lt;dl&gt;
  &lt;dt&gt;HTML&lt;/dt&gt;
  &lt;dd&gt;Linguagem de marcação&lt;/dd&gt;
&lt;/dl&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <h3>4.2) Elementos Inline (Texto em linha)</h3>
  <table>
    <thead>
      <tr>
        <th>Tag</th>
        <th>Descrição</th>
        <th>Exemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&lt;a&gt;</code></td>
        <td>Hiperlink.</td>
        <td>
          <pre class="snippet">&lt;a href="https://exemplo.com" target="_blank"&gt;Visitar&lt;/a&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;em&gt;</code>, <code>&lt;strong&gt;</code></td>
        <td>Ênfase (<code>&lt;em&gt;</code>) e destaque (<code>&lt;strong&gt;</code>).</td>
        <td>
          <pre class="snippet">&lt;p&gt;Use &lt;em&gt;ênfase&lt;/em&gt; e &lt;strong&gt;destaque&lt;/strong&gt;.&lt;/p&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;small&gt;</code>, <code>&lt;s&gt;</code>, <code>&lt;cite&gt;</code>, <code>&lt;q&gt;</code></td>
        <td>Pequeno, tachado, citação de referência, citação curta.</td>
        <td>
          <pre class="snippet">&lt;small&gt;Texto menor&lt;/small&gt;
&lt;s&gt;Texto tachado&lt;/s&gt;
&lt;cite&gt;Título de Obra&lt;/cite&gt;
&lt;q&gt;Citação curta&lt;/q&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;abbr&gt;</code></td>
        <td>Abreviação (com <code>title</code> explicando).</td>
        <td>
          <pre class="snippet">&lt;abbr title="Hypertext Markup Language"&gt;HTML&lt;/abbr&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;dfn&gt;</code></td>
        <td>Marca a definição de um termo.</td>
        <td>
          <pre class="snippet">&lt;p&gt;O &lt;dfn&gt;HTML&lt;/dfn&gt; é uma linguagem de marcação...&lt;/p&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;i&gt;</code>, <code>&lt;b&gt;</code>, <code>&lt;u&gt;</code>, <code>&lt;mark&gt;</code></td>
        <td>Itálico, negrito, sublinhado, texto destacado.</td>
        <td>
          <pre class="snippet">&lt;i&gt;Texto itálico&lt;/i&gt;
&lt;b&gt;Texto negrito&lt;/b&gt;
&lt;u&gt;Texto sublinhado&lt;/u&gt;
&lt;mark&gt;Texto destacado&lt;/mark&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;span&gt;</code></td>
        <td>Contêiner em linha genérico.</td>
        <td>
          <pre class="snippet">&lt;span class="enfatizar"&gt;Texto em linha&lt;/span&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;br&gt;</code></td>
        <td>Quebra de linha.</td>
        <td>
          <pre class="snippet">Texto linha 1&lt;br&gt;Texto linha 2</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;wbr&gt;</code></td>
        <td>Ponto de possível quebra de palavra.</td>
        <td>
          <pre class="snippet">Supercalifra&lt;wbr&gt;gilistic</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;bdi&gt;</code>, <code>&lt;bdo&gt;</code></td>
        <td>Isola ou define direcionalidade do texto (ex.: RTL).</td>
        <td>
          <pre class="snippet">&lt;bdo dir="rtl"&gt;Texto invertido&lt;/bdo&gt;
&lt;bdi dir="rtl"&gt;Exemplo&lt;/bdi&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;time&gt;</code></td>
        <td>Representa data/hora (legível por máquinas).</td>
        <td>
          <pre class="snippet">&lt;time datetime="2025-02-06"&gt;06/02/2025&lt;/time&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;var&gt;</code>, <code>&lt;samp&gt;</code>, <code>&lt;kbd&gt;</code>, <code>&lt;code&gt;</code></td>
        <td>Representam variável, saída de computador, entrada de teclado e código fonte.</td>
        <td>
          <pre class="snippet">&lt;p&gt;Digite &lt;kbd&gt;Ctrl + C&lt;/kbd&gt;.&lt;/p&gt;
&lt;code&gt;console.log('Hello')&lt;/code&gt;
&lt;var&gt;x&lt;/var&gt; = 10
&lt;samp&gt;Output: 42&lt;/samp&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;sub&gt;</code>, <code>&lt;sup&gt;</code></td>
        <td>Subscrito e sobrescrito (química, matemática).</td>
        <td>
          <pre class="snippet">H&lt;sub&gt;2&lt;/sub&gt;O e E=mc&lt;sup&gt;2&lt;/sup&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;ruby&gt;</code>, <code>&lt;rt&gt;</code>, <code>&lt;rp&gt;</code>, <code>&lt;rtc&gt;</code></td>
        <td>Anotações fonéticas ou de pronúncia (principalmente para idiomas asiáticos).</td>
        <td>
          <pre class="snippet">&lt;ruby&gt;漢&lt;rt&gt;hàn&lt;/rt&gt;&lt;/ruby&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;data&gt;</code></td>
        <td>Associa conteúdo legível a valor de máquina.</td>
        <td>
          <pre class="snippet">&lt;data value="1234"&gt;Produto #1234&lt;/data&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <h3>4.3) Marcação de Edição</h3>
  <table>
    <thead>
      <tr>
        <th>Tag</th>
        <th>Descrição</th>
        <th>Exemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&lt;ins&gt;</code></td>
        <td>Texto inserido (destacado, geralmente sublinhado).</td>
        <td>
          <pre class="snippet">&lt;ins&gt;Texto inserido&lt;/ins&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;del&gt;</code></td>
        <td>Texto removido (geralmente tachado).</td>
        <td>
          <pre class="snippet">&lt;del&gt;Texto removido&lt;/del&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ==================================
       5) TABELAS
       ================================== -->
  <h2>5) Tabelas (Tabular Data)</h2>
  <table>
    <thead>
      <tr>
        <th>Tag</th>
        <th>Descrição</th>
        <th>Exemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&lt;table&gt;</code></td>
        <td>Define a tabela.</td>
        <td>
          <pre class="snippet">&lt;table&gt;...&lt;/table&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;caption&gt;</code></td>
        <td>Título/legenda da tabela.</td>
        <td>
          <pre class="snippet">&lt;table&gt;
  &lt;caption&gt;Minha Tabela&lt;/caption&gt;
&lt;/table&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;colgroup&gt;</code>, <code>&lt;col&gt;</code></td>
        <td>Agrupa/define propriedades para colunas.</td>
        <td>
          <pre class="snippet">&lt;table&gt;
  &lt;colgroup&gt;
    &lt;col style="background:#f0f0f0"&gt;
    &lt;col style="background:#fff"&gt;
  &lt;/colgroup&gt;
&lt;/table&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, <code>&lt;tfoot&gt;</code></td>
        <td>Cabeçalho, corpo e rodapé da tabela.</td>
        <td>
          <pre class="snippet">&lt;table&gt;
  &lt;thead&gt;...&lt;/thead&gt;
  &lt;tbody&gt;...&lt;/tbody&gt;
  &lt;tfoot&gt;...&lt;/tfoot&gt;
&lt;/table&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;tr&gt;</code></td>
        <td>Linha da tabela.</td>
        <td>
          <pre class="snippet">&lt;tr&gt;&lt;td&gt;Célula&lt;/td&gt;&lt;td&gt;Célula&lt;/td&gt;&lt;/tr&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;th&gt;</code>, <code>&lt;td&gt;</code></td>
        <td>Célula de cabeçalho e célula de dados.</td>
        <td>
          <pre class="snippet">&lt;tr&gt;
  &lt;th&gt;Título Coluna&lt;/th&gt;
  &lt;td&gt;Dado&lt;/td&gt;
&lt;/tr&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ==================================
       6) MÍDIA E CONTEÚDO AVANÇADO
       ================================== -->
  <h2>6) Mídia e Conteúdo Avançado</h2>
  <table>
    <thead>
      <tr>
        <th>Tag</th>
        <th>Descrição</th>
        <th>Exemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&lt;img&gt;</code></td>
        <td>Exibe uma imagem; atributo <code>alt</code> é fundamental.</td>
        <td>
          <pre class="snippet">&lt;img src="exemplo.png" alt="Descrição da imagem"&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;figure&gt;</code>, <code>&lt;figcaption&gt;</code></td>
        <td>Agrupa imagem (ou outra mídia) e legenda.</td>
        <td>
          <pre class="snippet">&lt;figure&gt;
  &lt;img src="img.png" alt="Exemplo"&gt;
  &lt;figcaption&gt;Legenda da figura&lt;/figcaption&gt;
&lt;/figure&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;picture&gt;</code>, <code>&lt;source&gt;</code></td>
        <td>Imagens responsivas (vários formatos/resoluções).</td>
        <td>
          <pre class="snippet">&lt;picture&gt;
  &lt;source srcset="img-small.jpg" media="(max-width:600px)"&gt;
  &lt;source srcset="img-large.jpg" media="(min-width:601px)"&gt;
  &lt;img src="img-default.jpg" alt="Imagem Responsiva"&gt;
&lt;/picture&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;map&gt;</code>, <code>&lt;area&gt;</code></td>
        <td>Mapa de imagem (regiões clicáveis).</td>
        <td>
          <pre class="snippet">&lt;img src="mapa.png" usemap="#meumapa" alt="Mapa"&gt;
&lt;map name="meumapa"&gt;
  &lt;area shape="rect" coords="0,0,50,50" href="#" alt="Retangulo"&gt;
&lt;/map&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;video&gt;</code>, <code>&lt;audio&gt;</code>, <code>&lt;track&gt;</code></td>
        <td>Vídeo, áudio e legendas/legenda oculta.</td>
        <td>
          <pre class="snippet">&lt;video width="320" controls&gt;
  &lt;source src="video.mp4" type="video/mp4"&gt;
  &lt;track src="legenda.vtt" kind="subtitles" srclang="pt" label="Português"&gt;
&lt;/video&gt;

&lt;audio controls&gt;
  &lt;source src="audio.mp3" type="audio/mpeg"&gt;
&lt;/audio&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;canvas&gt;</code></td>
        <td>Área de desenho manipulável via JS (gráficos 2D/3D).</td>
        <td>
          <pre class="snippet">&lt;canvas id="meuCanvas" width="200" height="100"&gt;
Seu navegador não suporta canvas
&lt;/canvas&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ==================================
       7) CONTEÚDO INCORPORADO
       ================================== -->
  <h2>7) Conteúdo Incorporado</h2>
  <table>
    <thead>
      <tr>
        <th>Tag</th>
        <th>Descrição</th>
        <th>Exemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&lt;iframe&gt;</code></td>
        <td>Incorpora outra página HTML.</td>
        <td>
          <pre class="snippet">&lt;iframe src="https://exemplo.com" width="400" height="300"&gt;&lt;/iframe&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;embed&gt;</code></td>
        <td>Incorpora recursos externos (PDF, plugins).</td>
        <td>
          <pre class="snippet">&lt;embed src="exemplo.pdf" type="application/pdf" width="400" height="300"&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;object&gt;</code>, <code>&lt;param&gt;</code></td>
        <td>Conteúdo externo (substituído com frequência por <code>&lt;embed&gt;</code>).</td>
        <td>
          <pre class="snippet">&lt;object data="exemplo.pdf" type="application/pdf" width="400" height="300"&gt;
  &lt;param name="paramEx" value="valor"&gt;
  Conteúdo alternativo se não carregar
&lt;/object&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ==================================
       8) FORMULÁRIOS
       ================================== -->
  <h2>8) Formulários e Controle de Dados</h2>
  <table>
    <thead>
      <tr>
        <th>Tag</th>
        <th>Descrição</th>
        <th>Exemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&lt;form&gt;</code></td>
        <td>Define o formulário. <code>action</code>, <code>method</code>, etc.</td>
        <td>
          <pre class="snippet">&lt;form action="/enviar" method="post"&gt;
  ...
&lt;/form&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;label&gt;</code></td>
        <td>Rótulo para campo de formulário (associado via <code>for</code> e <code>id</code>).</td>
        <td>
          <pre class="snippet">&lt;label for="nome"&gt;Nome:&lt;/label&gt;
&lt;input type="text" id="nome" name="nome"&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;input&gt;</code></td>
        <td>Campo de entrada (tipos: <code>text</code>, <code>email</code>, <code>radio</code>, etc.).</td>
        <td>
          <pre class="snippet">&lt;input type="text" name="usuario"&gt;
&lt;input type="email" name="email"&gt;
&lt;input type="radio" name="opcao" value="1"&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;button&gt;</code></td>
        <td>Botão (<code>submit</code>, <code>reset</code>, <code>button</code>).</td>
        <td>
          <pre class="snippet">&lt;button type="submit"&gt;Enviar&lt;/button&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;select&gt;</code>, <code>&lt;option&gt;</code>, <code>&lt;optgroup&gt;</code></td>
        <td>Lista suspensa (dropdown).</td>
        <td>
          <pre class="snippet">&lt;select name="opcoes"&gt;
  &lt;optgroup label="Grupo 1"&gt;
    &lt;option&gt;Item 1&lt;/option&gt;
    &lt;option&gt;Item 2&lt;/option&gt;
  &lt;/optgroup&gt;
&lt;/select&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;textarea&gt;</code></td>
        <td>Campo de texto multilinha.</td>
        <td>
          <pre class="snippet">&lt;textarea name="mensagem" rows="4" cols="50"&gt;&lt;/textarea&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;fieldset&gt;</code>, <code>&lt;legend&gt;</code></td>
        <td>Agrupamento de campos com legenda.</td>
        <td>
          <pre class="snippet">&lt;fieldset&gt;
  &lt;legend&gt;Dados Pessoais&lt;/legend&gt;
  &lt;label&gt;Nome: &lt;/label&gt; &lt;input type="text"&gt;
&lt;/fieldset&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;datalist&gt;</code></td>
        <td>Lista de opções para auto-complete em <code>&lt;input&gt;</code>.</td>
        <td>
          <pre class="snippet">&lt;input list="linguagens" name="linguagem"&gt;
&lt;datalist id="linguagens"&gt;
  &lt;option value="HTML"&gt;
  &lt;option value="CSS"&gt;
&lt;/datalist&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;output&gt;</code></td>
        <td>Exibe resultado de cálculo ou script.</td>
        <td>
          <pre class="snippet">&lt;output name="resultado"&gt;0&lt;/output&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;progress&gt;</code></td>
        <td>Barra de progresso.</td>
        <td>
          <pre class="snippet">&lt;progress value="30" max="100"&gt;30%&lt;/progress&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;meter&gt;</code></td>
        <td>Indica medição em um intervalo (ex.: bateria).</td>
        <td>
          <pre class="snippet">&lt;meter value="2" min="0" max="10"&gt;2 de 10&lt;/meter&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ==================================
       9) ELEMENTOS INTERATIVOS
       ================================== -->
  <h2>9) Elementos Interativos</h2>
  <table>
    <thead>
      <tr>
        <th>Tag</th>
        <th>Descrição</th>
        <th>Exemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&lt;details&gt;</code>, <code>&lt;summary&gt;</code></td>
        <td>Bloco de conteúdo expansível/colapsável.</td>
        <td>
          <pre class="snippet">&lt;details&gt;
  &lt;summary&gt;Clique para expandir&lt;/summary&gt;
  &lt;p&gt;Texto escondido...&lt;/p&gt;
&lt;/details&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;dialog&gt;</code></td>
        <td>Caixa de diálogo nativa (modal).</td>
        <td>
          <pre class="snippet">&lt;dialog id="meuDialog"&gt;
  &lt;p&gt;Conteúdo do diálogo&lt;/p&gt;
  &lt;button onclick="this.closest('dialog').close()"&gt;Fechar&lt;/button&gt;
&lt;/dialog&gt;
&lt;button onclick="document.getElementById('meuDialog').showModal()"&gt;Abrir&lt;/button&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;menu&gt;</code></td>
        <td>Lista de comandos/opções (pouco utilizada).</td>
        <td>
          <pre class="snippet">&lt;menu&gt;
  &lt;li&gt;&lt;a href="#"&gt;Item 1&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#"&gt;Item 2&lt;/a&gt;&lt;/li&gt;
&lt;/menu&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;template&gt;</code></td>
        <td>Fragmento de HTML não renderizado até ser manipulado por JS.</td>
        <td>
          <pre class="snippet">&lt;template id="tmpl"&gt;
  &lt;p&gt;Texto dentro do template&lt;/p&gt;
&lt;/template&gt;

&lt;script&gt;
  const temp = document.getElementById('tmpl');
  const clone = temp.content.cloneNode(true);
  document.body.appendChild(clone);
&lt;/script&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;slot&gt;</code></td>
        <td>Espaço reservado em Web Components (Shadow DOM).</td>
        <td>
          <pre class="snippet">&lt;!-- Usado dentro de um Web Component --&gt;
&lt;slot name="conteudo"&gt;Fallback&lt;/slot&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ==================================
       10) ATRIBUTOS GLOBAIS E DATA-*
       ================================== -->
  <h2>10) Atributos Globais e <code>data-*</code></h2>
  <p>Todos os elementos HTML podem ter atributos globais, como <code>id</code>, <code>class</code>, <code>style</code>, <code>title</code>, <code>tabindex</code>, <code>lang</code>, <code>dir</code>, <code>hidden</code>, <code>draggable</code>, <code>data-*</code>, etc.</p>
  <table>
    <thead>
      <tr>
        <th>Atributo</th>
        <th>Descrição</th>
        <th>Exemplo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>id</code>, <code>class</code></td>
        <td>Identificação única (<code>id</code>) e classes (<code>class</code>) para estilização/seletores JS.</td>
        <td>
          <pre class="snippet">&lt;div id="principal" class="container"&gt;...&lt;/div&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>style</code></td>
        <td>CSS inline no próprio elemento.</td>
        <td>
          <pre class="snippet">&lt;p style="color:red;"&gt;Texto Vermelho&lt;/p&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>title</code></td>
        <td>Texto de dica (tooltip) ao passar o mouse.</td>
        <td>
          <pre class="snippet">&lt;span title="Dica"&gt;Passe o mouse aqui&lt;/span&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>lang</code>, <code>dir</code></td>
        <td>Especifica idioma e direção de texto (ex.: <code>dir="rtl"</code>).</td>
        <td>
          <pre class="snippet">&lt;p lang="en" dir="ltr"&gt;Hello&lt;/p&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>hidden</code></td>
        <td>Oculta o elemento sem removê-lo do DOM.</td>
        <td>
          <pre class="snippet">&lt;div hidden&gt;Não aparece&lt;/div&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>data-*</code></td>
        <td>Atributos de dados personalizados.</td>
        <td>
          <pre class="snippet">&lt;div data-produto-id="1234" data-preco="10.99"&gt;&lt;/div&gt;
&lt;script&gt;
  const div = document.querySelector('[data-produto-id]');
  console.log(div.dataset.preco);
&lt;/script&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ==================================
       11) TAGS OBSOLETAS
       ================================== -->
  <h2>11) Tags Obsoletas (Evitar Uso)</h2>
  <p>Estas tags não devem ser usadas em projetos modernos. Elas aparecem em códigos antigos ou não são padrões oficiais do HTML5.</p>
  <table>
    <thead>
      <tr>
        <th>Tag</th>
        <th>Motivo</th>
        <th>Exemplo (Não utilizar!)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>&lt;font&gt;</code></td>
        <td>Estilização deve ser feita via CSS.</td>
        <td>
          <pre class="snippet">&lt;font color="red"&gt;Texto&lt;/font&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;center&gt;</code></td>
        <td>Para centralizar, use <code>text-align: center</code> no CSS.</td>
        <td>
          <pre class="snippet">&lt;center&gt;Texto&lt;/center&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;marquee&gt;</code></td>
        <td>Nunca foi padrão oficial, comportamento não confiável.</td>
        <td>
          <pre class="snippet">&lt;marquee&gt;Texto rolando&lt;/marquee&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;big&gt;</code>, <code>&lt;strike&gt;</code>, <code>&lt;tt&gt;</code>, etc.</td>
        <td>Substituídas por CSS ou tags semânticas adequadas.</td>
        <td>
          <pre class="snippet">&lt;big&gt;Texto grande&lt;/big&gt;
&lt;strike&gt;Texto tachado&lt;/strike&gt;</pre>
        </td>
      </tr>
      <tr>
        <td><code>&lt;frameset&gt;</code>, <code>&lt;frame&gt;</code>, <code>&lt;noframes&gt;</code></td>
        <td>Antigo sistema de “molduras” para layout, obsoleto no HTML5.</td>
        <td>
          <pre class="snippet">&lt;frameset cols="50%,50%"&gt;
  &lt;frame src="left.html"&gt;
  &lt;frame src="right.html"&gt;
&lt;/frameset&gt;</pre>
        </td>
      </tr>
    </tbody>
  </table>

  <hr>

  <footer>
    <p><strong>Conclusão:</strong> Esta grade curricular abrange praticamente todas as tags do HTML5, com pequenos exemplos de cada. Lembre-se de focar em <em>boas práticas</em>, <em>semântica</em>, e <em>acessibilidade</em> no uso de cada elemento.</p>
  </footer>

</body>
</html>

```