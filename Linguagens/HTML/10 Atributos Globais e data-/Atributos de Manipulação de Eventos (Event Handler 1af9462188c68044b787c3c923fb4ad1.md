# Atributos de Manipulação de Eventos (Event Handlers)

> Observação:
> 
> 
> Nos event handlers, o valor é um trecho de código JavaScript (em forma de string) a ser executado quando o evento ocorre. Por esse motivo, não há um conjunto de valores enumerados fixos; o valor é livre, mas espera-se que seja um código válido.
> 
1. **onabort**
    - **Descrição:** Executado quando uma operação (como o carregamento de mídia) é abortada.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onabort="console.log('Operação abortada!')">Seu navegador não suporta vídeos.</video>
        
        ```
        
2. **onanimationend**
    - **Descrição:** Executado ao término de uma animação CSS.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onanimationend="alert('Animação terminou!')" style="animation: fade 2s;">Animado</div>
        
        ```
        
3. **onanimationiteration**
    - **Descrição:** Dispara a cada repetição de uma animação CSS.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onanimationiteration="console.log('Nova iteração da animação')" style="animation: spin 1s infinite;">Girando</div>
        
        ```
        
4. **onanimationstart**
    - **Descrição:** Executado no início de uma animação CSS.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onanimationstart="console.log('Animação iniciada')" style="animation: bounce 1s;">Pular</div>
        
        ```
        
5. **onauxclick**
    - **Descrição:** Dispara quando ocorre um clique com um botão auxiliar (não o principal).
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <button onauxclick="alert('Clique com botão auxiliar detectado')">Clique com outro botão</button>
        
        ```
        
6. **onbeforeinput**
    - **Descrição:** Dispara antes de inserir dados em um campo editável.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <input type="text" onbeforeinput="console.log('Antes de inserir texto')" placeholder="Digite algo">
        
        ```
        
7. **onblur**
    - **Descrição:** Executado quando o elemento perde o foco.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <input type="text" onblur="console.log('Elemento perdeu o foco')" placeholder="Clique e depois saia">
        
        ```
        
8. **oncancel**
    - **Descrição:** Dispara quando uma ação é cancelada, como o fechamento de um `<dialog>`.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <dialog oncancel="console.log('Diálogo cancelado')">Conteúdo do Diálogo</dialog>
        
        ```
        
9. **oncanplay**
    - **Descrição:** Executado quando o navegador determina que um mídia pode começar a reproduzir sem interrupções.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" oncanplay="console.log('Pode começar a reproduzir')">Vídeo</video>
        
        ```
        
10. **oncanplaythrough**
    - **Descrição:** Indica que o mídia pode ser reproduzido até o fim sem interrupções.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" oncanplaythrough="console.log('Reprodução contínua possível')">Vídeo</video>
        
        ```
        
11. **onchange**
    - **Descrição:** Dispara quando há alteração no valor de um campo.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <input type="text" onchange="console.log('Valor alterado')" placeholder="Altere o valor">
        
        ```
        
12. **onclick**
    - **Descrição:** Executado quando o elemento é clicado.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <button onclick="console.log('Botão clicado')">Clique Aqui</button>
        
        ```
        
13. **onclose**
    - **Descrição:** Executado quando um elemento (como `<dialog>`) é fechado.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <dialog onclose="console.log('Diálogo fechado')">Conteúdo do Diálogo</dialog>
        
        ```
        
14. **oncontextmenu**
    - **Descrição:** Dispara ao clicar com o botão direito, abrindo o menu de contexto.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div oncontextmenu="alert('Menu de contexto ativado'); return false;">Clique com o botão direito</div>
        
        ```
        
15. **oncopy**
    - **Descrição:** Executado quando o conteúdo é copiado para a área de transferência.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <p oncopy="alert('Conteúdo copiado')">Copie este parágrafo.</p>
        
        ```
        
16. **oncuechange**
    - **Descrição:** Dispara quando há alteração na pista de mídia (legendas, por exemplo).
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <track kind="subtitles" src="legenda.vtt" oncuechange="console.log('Legenda atualizada')">
        
        ```
        
17. **oncut**
    - **Descrição:** Executado quando o conteúdo é cortado para a área de transferência.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <input type="text" oncut="console.log('Texto cortado')" placeholder="Tente cortar este texto">
        
        ```
        
18. **ondblclick**
    - **Descrição:** Executado em resposta a um clique duplo.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <button ondblclick="console.log('Clique duplo detectado')">Clique Duplo</button>
        
        ```
        
19. **ondrag**
    - **Descrição:** Dispara enquanto um elemento está sendo arrastado.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div draggable="true" ondrag="console.log('Elemento está sendo arrastado')">Arraste-me</div>
        
        ```
        
20. **ondragend**
    - **Descrição:** Executado quando a operação de arrastar termina.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div draggable="true" ondragend="console.log('Arrasto finalizado')">Arraste-me</div>
        
        ```
        
21. **ondragenter**
    - **Descrição:** Dispara quando um elemento arrastado entra em uma área de drop.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div ondragenter="console.log('Elemento entrou na área de drop')">Área de drop</div>
        
        ```
        
22. **ondragleave**
    - **Descrição:** Executado quando o elemento arrastado sai da área de drop.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div ondragleave="console.log('Elemento saiu da área de drop')">Área de drop</div>
        
        ```
        
23. **ondragover**
    - **Descrição:** Dispara enquanto um elemento é arrastado sobre uma área que permite o drop (geralmente precisa chamar event.preventDefault()).
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div ondragover="event.preventDefault(); console.log('Elemento sobre a área de drop')" style="height: 100px; border: 1px dashed #aaa;">
          Arraste aqui
        </div>
        
        ```
        
24. **ondragstart**
    - **Descrição:** Executado no início da operação de arrastar.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div draggable="true" ondragstart="console.log('Início do arrasto')">Comece a arrastar</div>
        
        ```
        
25. **ondrop**
    - **Descrição:** Dispara quando o elemento é solto em uma área de drop.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div ondrop="event.preventDefault(); console.log('Elemento solto na área de drop')" style="height: 100px; border: 1px solid #333;">
          Solte aqui
        </div>
        
        ```
        
26. **ondurationchange**
    - **Descrição:** Executado quando a duração de um mídia muda.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" ondurationchange="console.log('Duração do vídeo alterada')">Vídeo</video>
        
        ```
        
27. **onemptied**
    - **Descrição:** Dispara quando o elemento de mídia fica sem dados.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onemptied="console.log('Mídia ficou vazia')">Vídeo</video>
        
        ```
        
28. **onended**
    - **Descrição:** Executado quando a reprodução de um mídia termina.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onended="console.log('Vídeo terminou')">Vídeo</video>
        
        ```
        
29. **onerror**
    - **Descrição:** Dispara quando ocorre um erro ao carregar ou executar o elemento.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <img src="inexistente.jpg" onerror="console.log('Erro ao carregar a imagem')" alt="Imagem">
        
        ```
        
30. **onfocus**
    - **Descrição:** Executado quando o elemento recebe foco.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <input type="text" onfocus="console.log('Elemento recebeu foco')" placeholder="Clique aqui">
        
        ```
        
31. **onfocusin**
    - **Descrição:** Similar ao onfocus, mas propaga quando um descendente recebe foco.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onfocusin="console.log('Focusin detectado')">
          <input type="text" placeholder="Dentro do div">
        </div>
        
        ```
        
32. **onfocusout**
    - **Descrição:** Dispara quando o elemento ou seus descendentes perdem o foco.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onfocusout="console.log('Focusout detectado')">
          <input type="text" placeholder="Dentro do div">
        </div>
        
        ```
        
33. **onformdata**
    - **Descrição:** Executado quando os dados de um formulário são processados.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <form onformdata="console.log('Dados do formulário processados')">
          <input type="text" name="campo">
        </form>
        
        ```
        
34. **oninput**
    - **Descrição:** Dispara a cada alteração no valor de um campo enquanto o usuário digita.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <input type="text" oninput="console.log('Entrada alterada')" placeholder="Digite algo">
        
        ```
        
35. **oninvalid**
    - **Descrição:** Executado quando um campo falha na validação.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <input type="email" oninvalid="console.log('Valor inválido')" required placeholder="Email">
        
        ```
        
36. **onkeydown**
    - **Descrição:** Dispara quando uma tecla é pressionada.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <input type="text" onkeydown="console.log('Tecla pressionada')" placeholder="Pressione uma tecla">
        
        ```
        
37. **onkeypress**
    - **Descrição:** Executado enquanto uma tecla é pressionada (considerado obsoleto em favor de onkeydown/onkeyup).
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <input type="text" onkeypress="console.log('Tecla sendo pressionada')" placeholder="Pressione uma tecla">
        
        ```
        
38. **onkeyup**
    - **Descrição:** Dispara quando uma tecla é liberada após ser pressionada.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <input type="text" onkeyup="console.log('Tecla liberada')" placeholder="Digite algo">
        
        ```
        
39. **onload**
    - **Descrição:** Executado quando o documento ou elemento é completamente carregado.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <body onload="console.log('Página carregada')">
          Conteúdo da página.
        </body>
        
        ```
        
40. **onloadeddata**
    - **Descrição:** Dispara quando os dados de um mídia estão disponíveis para reprodução.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onloadeddata="console.log('Dados do vídeo carregados')">Vídeo</video>
        
        ```
        
41. **onloadedmetadata**
    - **Descrição:** Executado quando os metadados do mídia (como duração) estão disponíveis.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onloadedmetadata="console.log('Metadata do vídeo carregada')">Vídeo</video>
        
        ```
        
42. **onloadstart**
    - **Descrição:** Dispara no início do carregamento de um recurso, como um mídia.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onloadstart="console.log('Início do carregamento do vídeo')">Vídeo</video>
        
        ```
        
43. **onmousedown**
    - **Descrição:** Executado quando o botão do mouse é pressionado sobre o elemento.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <button onmousedown="console.log('Botão do mouse pressionado')">Clique</button>
        
        ```
        
44. **onmouseenter**
    - **Descrição:** Dispara quando o mouse entra na área do elemento (não propaga).
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onmouseenter="console.log('Mouse entrou no elemento')" style="padding:20px; border:1px solid #ccc;">
          Passe o mouse aqui
        </div>
        
        ```
        
45. **onmouseleave**
    - **Descrição:** Executado quando o mouse sai da área do elemento (não propaga).
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onmouseleave="console.log('Mouse saiu do elemento')" style="padding:20px; border:1px solid #ccc;">
          Passe o mouse aqui
        </div>
        
        ```
        
46. **onmousemove**
    - **Descrição:** Dispara enquanto o mouse se move dentro do elemento.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onmousemove="console.log('Movendo o mouse')" style="height:100px; border:1px dashed #aaa;">
          Mova o mouse dentro desta área
        </div>
        
        ```
        
47. **onmouseout**
    - **Descrição:** Executado quando o mouse sai do elemento.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onmouseout="console.log('Mouse saiu da área')" style="height:100px; border:1px dashed #aaa;">
          Mova o mouse e saia desta área
        </div>
        
        ```
        
48. **onmouseover**
    - **Descrição:** Dispara quando o mouse entra na área do elemento.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onmouseover="console.log('Mouse sobre o elemento')" style="height:100px; border:1px dashed #aaa;">
          Passe o mouse sobre esta área
        </div>
        
        ```
        
49. **onmouseup**
    - **Descrição:** Executado quando o botão do mouse é liberado sobre o elemento.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <button onmouseup="console.log('Botão do mouse liberado')">Clique e solte</button>
        
        ```
        
50. **onmousewheel**
    - **Descrição:** Dispara quando ocorre um evento de roda do mouse (evento não padrão, mas suportado).
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onmousewheel="console.log('Evento de roda do mouse')" style="height:100px; overflow:auto;">
          Role com o mouse aqui
        </div>
        
        ```
        
51. **onpaste**
    - **Descrição:** Executado quando o usuário cola conteúdo no elemento.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <input type="text" onpaste="console.log('Conteúdo colado')" placeholder="Cole algo aqui">
        
        ```
        
52. **onpause**
    - **Descrição:** Dispara quando a reprodução de um mídia é pausada.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onpause="console.log('Vídeo pausado')">Vídeo</video>
        
        ```
        
53. **onplay**
    - **Descrição:** Executado quando a reprodução de um mídia inicia.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onplay="console.log('Vídeo iniciado')">Vídeo</video>
        
        ```
        
54. **onplaying**
    - **Descrição:** Dispara quando a reprodução de um mídia recomeça ou está efetivamente em andamento.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onplaying="console.log('Vídeo em reprodução')">Vídeo</video>
        
        ```
        
55. **onprogress**
    - **Descrição:** Dispara periodicamente para indicar o progresso do carregamento de um recurso.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onprogress="console.log('Progresso do carregamento')">Vídeo</video>
        
        ```
        
56. **onratechange**
    - **Descrição:** Executado quando a taxa de reprodução de um mídia é alterada.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onratechange="console.log('Taxa de reprodução alterada')">Vídeo</video>
        
        ```
        
57. **onreset**
    - **Descrição:** Dispara quando um formulário é redefinido.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <form onreset="console.log('Formulário resetado')">
          <input type="text" value="Algum texto">
          <button type="reset">Resetar</button>
        </form>
        
        ```
        
58. **onresize**
    - **Descrição:** Executado quando um elemento redimensionável ou a janela é alterada de tamanho.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onresize="console.log('Elemento redimensionado')" style="resize: both; overflow: auto; width: 150px; height: 100px; border:1px solid #000;">
          Redimensione-me
        </div>
        
        ```
        
59. **onscroll**
    - **Descrição:** Dispara quando ocorre rolagem dentro de um elemento ou na janela.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onscroll="console.log('Área rolada')" style="overflow: auto; height: 100px; border:1px solid #ccc;">
          <p>Muito conteúdo aqui para rolar...</p>
        </div>
        
        ```
        
60. **onseeked**
    - **Descrição:** Executado quando o usuário termina de alterar a posição de reprodução (seek) em um mídia.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onseeked="console.log('Busca finalizada')">Vídeo</video>
        
        ```
        
61. **onseeking**
    - **Descrição:** Dispara enquanto o usuário altera a posição de reprodução em um mídia.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onseeking="console.log('Buscando posição')">Vídeo</video>
        
        ```
        
62. **onselect**
    - **Descrição:** Executado quando o usuário faz uma seleção de texto em um campo.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <input type="text" onselect="console.log('Texto selecionado')" placeholder="Selecione parte do texto">
        
        ```
        
63. **onselectionchange**
    - **Descrição:** Dispara quando a seleção de texto na página é alterada.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onselectionchange="console.log('Mudança na seleção de texto')">
          Texto que pode ser selecionado.
        </div>
        
        ```
        
64. **onselectstart**
    - **Descrição:** Executado quando o processo de seleção de texto inicia.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onselectstart="console.log('Início da seleção de texto')">
          Tente selecionar este texto.
        </div>
        
        ```
        
65. **onstalled**
    - **Descrição:** Dispara quando o carregamento de um mídia é interrompido ou fica estagnado.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onstalled="console.log('Carregamento interrompido')">Vídeo</video>
        
        ```
        
66. **onsubmit**
    - **Descrição:** Executado quando um formulário é submetido, permitindo validação ou ações antes do envio.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <form onsubmit="console.log('Formulário submetido'); return false;">
          <input type="text" placeholder="Digite algo">
          <button type="submit">Enviar</button>
        </form>
        
        ```
        
67. **onsuspend**
    - **Descrição:** Dispara quando o carregamento de um recurso é suspenso.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onsuspend="console.log('Carregamento suspenso')">Vídeo</video>
        
        ```
        
68. **ontimeupdate**
    - **Descrição:** Executado quando o tempo atual de reprodução de um mídia é atualizado.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" ontimeupdate="console.log('Tempo atualizado na reprodução')">Vídeo</video>
        
        ```
        
69. **ontoggle**
    - **Descrição:** Dispara quando um elemento `<details>` é aberto ou fechado.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <details ontoggle="console.log('Detalhes alternados')">
          <summary>Mais informações</summary>
          Conteúdo detalhado.
        </details>
        
        ```
        
70. **ontransitionend**
    - **Descrição:** Executado quando uma transição CSS chega ao fim.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div ontransitionend="console.log('Transição CSS finalizada')" style="transition: all 1s; background-color: yellow;">
          Transição de cor
        </div>
        
        ```
        
71. **onvolumechange**
    - **Descrição:** Dispara quando o volume de um mídia é alterado.
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onvolumechange="console.log('Volume alterado')">Vídeo</video>
        
        ```
        
72. **onwaiting**
    - **Descrição:** Executado quando a reprodução de um mídia está aguardando por mais dados (buffering).
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <video src="video.mp4" onwaiting="console.log('Aguardando dados para reprodução')">Vídeo</video>
        
        ```
        
73. **onwheel**
    - **Descrição:** Dispara quando ocorre um evento de roda do mouse (scroll com a roda).
    - **Valor:** Código JavaScript.
    - **Exemplo:**
        
        ```html
        <div onwheel="console.log('Evento de roda do mouse detectado')" style="height:100px; overflow:auto;">
          Role com a roda do mouse aqui
        </div>
        
        ```
        

---

Esta compilação completa apresenta cada um dos 148 atributos (27 Globais, 48 ARIA e 73 Event Handlers) com sua finalidade, os valores possíveis (quando aplicável) e exemplos práticos de uso, servindo como uma referência abrangente para implementação em HTML5, com foco em semântica, interatividade e acessibilidade.