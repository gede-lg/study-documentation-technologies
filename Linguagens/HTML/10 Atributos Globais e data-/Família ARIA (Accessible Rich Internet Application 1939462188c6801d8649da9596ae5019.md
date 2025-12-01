# Família ARIA (Accessible Rich Internet Applications)

1. **aria-activedescendant**
    - **Descrição:** Indica qual descendente está atualmente ativo, mesmo que o foco permaneça no contêiner.
    - **Possíveis Valores:**
        - **Valor livre:** ID de um elemento filho.
    - **Exemplo:**
        
        ```html
        <ul aria-activedescendant="item2">
          <li id="item1">Item 1</li>
          <li id="item2">Item 2 (ativo)</li>
        </ul>
        
        ```
        
2. **aria-atomic**
    - **Descrição:** Determina se as mudanças no conteúdo devem ser anunciadas como um bloco único.
    - **Possíveis Valores:**
        - **"true":** A atualização é atômica (anunciada integralmente).
        - **"false":** Apenas partes alteradas são anunciadas.
    - **Exemplo:**
        
        ```html
        <div aria-atomic="true">Atualizações inteiras deste conteúdo serão anunciadas.</div>
        
        ```
        
3. **aria-autocomplete**
    - **Descrição:** Indica se um campo oferece sugestões de preenchimento e como elas são apresentadas.
    - **Possíveis Valores:**
        - **"none":** Sem preenchimento automático.
        - **"inline":** Preenche automaticamente o texto restante inline.
        - **"list":** Apresenta uma lista de sugestões.
        - **"both":** Combina preenchimento inline e lista de sugestões.
    - **Exemplo:**
        
        ```html
        <input type="text" aria-autocomplete="list" placeholder="Digite para ver sugestões">
        
        ```
        
4. **aria-busy**
    - **Descrição:** Informa que o elemento está processando ou carregando dados.
    - **Possíveis Valores:**
        - **"true":** O elemento está ocupado.
        - **"false":** O elemento está disponível.
    - **Exemplo:**
        
        ```html
        <div aria-busy="true">Carregando dados...</div>
        
        ```
        
5. **aria-checked**
    - **Descrição:** Indica o estado de seleção em controles como checkboxes e radio buttons.
    - **Possíveis Valores:**
        - **"true":** Marcado/selecionado.
        - **"false":** Não marcado.
        - **"mixed":** Estado misto (parcialmente selecionado).
    - **Exemplo:**
        
        ```html
        <input type="checkbox" aria-checked="false"> Opção não selecionada
        
        ```
        
6. **aria-colcount**
    - **Descrição:** Especifica o número total de colunas em uma tabela ou grid.
    - **Possíveis Valores:**
        - **Número:** Valor inteiro representando a quantidade de colunas.
    - **Exemplo:**
        
        ```html
        <table aria-colcount="3">
          <!-- Conteúdo da tabela -->
        </table>
        
        ```
        
7. **aria-colindex**
    - **Descrição:** Indica a posição (índice) de uma coluna em uma tabela ou grid.
    - **Possíveis Valores:**
        - **Número:** Valor inteiro representando a posição da coluna (inicia em 1).
    - **Exemplo:**
        
        ```html
        <td aria-colindex="2">Segunda coluna</td>
        
        ```
        
8. **aria-colspan**
    - **Descrição:** Define quantas colunas uma célula de tabela abrange.
    - **Possíveis Valores:**
        - **Número:** Valor inteiro (por exemplo, "2" para duas colunas).
    - **Exemplo:**
        
        ```html
        <td aria-colspan="2">Célula que abrange duas colunas</td>
        
        ```
        
9. **aria-controls**
    - **Descrição:** Indica quais elementos são controlados pelo elemento atual.
    - **Possíveis Valores:**
        - **Valor livre:** Lista de IDs (separados por espaço) dos elementos controlados.
    - **Exemplo:**
        
        ```html
        <button aria-controls="panel1">Mostrar Painel</button>
        <div id="panel1">Conteúdo do painel</div>
        
        ```
        
10. **aria-current**
    - **Descrição:** Indica que o elemento é o item “atual” em um conjunto.
    - **Possíveis Valores:**
        - **"page":** Item representa a página atual.
        - **"step":** Item atual em um processo sequencial.
        - **"location":** Item representa uma localização.
        - **"date":** Item representa uma data atual.
        - **"time":** Item representa uma hora atual.
        - **"true":** Ativo, sem especificar tipo.
        - **"false":** Não é o item atual.
    - **Exemplo:**
        
        ```html
        <li aria-current="page">Página Atual</li>
        
        ```
        
11. **aria-describedby**
    - **Descrição:** Associa o elemento a outros que fornecem uma descrição.
    - **Possíveis Valores:**
        - **Valor livre:** Lista de IDs dos elementos que descrevem o atual.
    - **Exemplo:**
        
        ```html
        <input type="text" aria-describedby="descInput">
        <div id="descInput">Digite seu nome completo.</div>
        
        ```
        
12. **aria-details**
    - **Descrição:** Fornece uma referência a um elemento que contém informações detalhadas sobre o atual.
    - **Possíveis Valores:**
        - **Valor livre:** Um ID que referencia o elemento com os detalhes.
    - **Exemplo:**
        
        ```html
        <div aria-details="detalhes1">Mais informações disponíveis.</div>
        <div id="detalhes1">Detalhes adicionais sobre o item.</div>
        
        ```
        
13. **aria-disabled**
    - **Descrição:** Indica que o elemento está desabilitado para interação.
    - **Possíveis Valores:**
        - **"true":** Elemento desabilitado.
        - **"false":** Elemento habilitado.
    - **Exemplo:**
        
        ```html
        <button aria-disabled="true">Botão Desabilitado</button>
        
        ```
        
14. **aria-dropeffect**
    - **Descrição:** (Obsoleto na ARIA 1.1) Especificava o efeito ao soltar um item em uma área de drop.
    - **Possíveis Valores:**
        - **"copy":** Copiar o item.
        - **"move":** Mover o item.
        - **"link":** Criar um link para o item.
        - **"execute":** Executar uma ação.
        - **"popup":** Abrir uma janela popup.
        - **"none":** Sem efeito.
    - **Exemplo:**
        
        ```html
        <div aria-dropeffect="move">Área de destino para arrastar</div>
        
        ```
        
15. **aria-errormessage**
    - **Descrição:** Associa uma mensagem de erro a um campo para validação acessível.
    - **Possíveis Valores:**
        - **Valor livre:** Um ID que referencia a mensagem de erro.
    - **Exemplo:**
        
        ```html
        <input type="text" aria-errormessage="errorMsg">
        <div id="errorMsg">Erro: valor inválido.</div>
        
        ```
        
16. **aria-expanded**
    - **Descrição:** Indica se um elemento expansível (menu, painel) está aberto ou fechado.
    - **Possíveis Valores:**
        - **"true":** Elemento expandido.
        - **"false":** Elemento recolhido.
    - **Exemplo:**
        
        ```html
        <button aria-expanded="false">Mostrar Mais</button>
        
        ```
        
17. **aria-flowto**
    - **Descrição:** Sugere uma ordem de fluxo de navegação para elementos relacionados.
    - **Possíveis Valores:**
        - **Valor livre:** Lista de IDs (separados por espaço) para onde o foco deve ir a seguir.
    - **Exemplo:**
        
        ```html
        <div aria-flowto="conteudoSecundario">Clique para mais informações</div>
        <div id="conteudoSecundario">Conteúdo adicional</div>
        
        ```
        
18. **aria-grabbed**
    - **Descrição:** Indica se o elemento foi “capturado” para arrastar.
    - **Possíveis Valores:**
        - **"true":** Elemento está capturado.
        - **"false":** Elemento não está capturado.
    - **Exemplo:**
        
        ```html
        <div draggable="true" aria-grabbed="false">Elemento arrastável</div>
        
        ```
        
19. **aria-haspopup**
    - **Descrição:** Informa que o elemento possui um menu ou popup associado.
    - **Possíveis Valores:**
        - **"menu":** Indica um menu.
        - **"listbox":** Indica uma lista de opções.
        - **"tree":** Indica uma estrutura de árvore.
        - **"grid":** Indica uma grade de dados.
        - **"dialog":** Indica um diálogo/modal.
        - **"true":** Indica popup, sem especificar o tipo.
        - **"false":** Não há popup.
    - **Exemplo:**
        
        ```html
        <button aria-haspopup="menu">Abrir Menu</button>
        
        ```
        
20. **aria-hidden**
    - **Descrição:** Esconde o elemento de tecnologias assistivas.
    - **Possíveis Valores:**
        - **"true":** O elemento é oculto para leitores de tela.
        - **"false":** O elemento é visível para leitores de tela.
    - **Exemplo:**
        
        ```html
        <div aria-hidden="true">Conteúdo que não deve ser anunciado</div>
        
        ```
        
21. **aria-invalid**
    - **Descrição:** Indica que o valor de um campo não passou na validação.
    - **Possíveis Valores:**
        - **"true":** Valor inválido.
        - **"false":** Valor válido.
        - **"grammar":** Erro de gramática.
        - **"spelling":** Erro de ortografia.
    - **Exemplo:**
        
        ```html
        <input type="email" aria-invalid="true" placeholder="Email inválido">
        
        ```
        
22. **aria-keyshortcuts**
    - **Descrição:** Define os atalhos de teclado para acionar o elemento.
    - **Possíveis Valores:**
        - **Valor livre:** Uma string com as combinações de teclas (ex.: "Ctrl+S").
    - **Exemplo:**
        
        ```html
        <button aria-keyshortcuts="Ctrl+S">Salvar com Atalho</button>
        
        ```
        
23. **aria-label**
    - **Descrição:** Fornece uma etiqueta textual para elementos que não têm conteúdo textual visível.
    - **Possíveis Valores:**
        - **Valor livre:** Qualquer string descritiva.
    - **Exemplo:**
        
        ```html
        <button aria-label="Fechar">X</button>
        
        ```
        
24. **aria-labelledby**
    - **Descrição:** Faz referência a um ou mais elementos que rotulam o elemento atual.
    - **Possíveis Valores:**
        - **Valor livre:** Lista de IDs (separados por espaço) dos elementos que servem de rótulo.
    - **Exemplo:**
        
        ```html
        <div aria-labelledby="label1">
          <span id="label1">Descrição do Conteúdo</span>
        </div>
        
        ```
        
25. **aria-level**
    - **Descrição:** Define o nível hierárquico do elemento, útil em estruturas de árvore ou listas.
    - **Possíveis Valores:**
        - **Número:** Valor inteiro representando o nível (ex.: 1, 2, 3, ...).
    - **Exemplo:**
        
        ```html
        <h2 aria-level="2">Título de Seção</h2>
        
        ```
        
26. **aria-live**
    - **Descrição:** Controla como as atualizações do conteúdo são anunciadas para usuários de tecnologias assistivas.
    - **Possíveis Valores:**
        - **"off":** Não anuncia mudanças.
        - **"polite":** Anuncia mudanças de forma discreta.
        - **"assertive":** Anuncia imediatamente, interrompendo outras notificações.
    - **Exemplo:**
        
        ```html
        <div aria-live="polite">Notificações serão lidas de forma educada.</div>
        
        ```
        
27. **aria-modal**
    - **Descrição:** Indica que um diálogo/modal bloqueia a interação com o restante da página.
    - **Possíveis Valores:**
        - **"true":** Modal ativo.
        - **"false":** Não é modal.
    - **Exemplo:**
        
        ```html
        <div role="dialog" aria-modal="true">Conteúdo do diálogo modal</div>
        
        ```
        
28. **aria-multiline**
    - **Descrição:** Indica se um campo de entrada permite múltiplas linhas.
    - **Possíveis Valores:**
        - **"true":** Permite várias linhas.
        - **"false":** Apenas uma linha.
    - **Exemplo:**
        
        ```html
        <textarea aria-multiline="true" placeholder="Digite seu comentário"></textarea>
        
        ```
        
29. **aria-multiselectable**
    - **Descrição:** Indica que um conjunto (lista, grid) permite seleção de múltiplos itens.
    - **Possíveis Valores:**
        - **"true":** Múltiplos itens podem ser selecionados.
        - **"false":** Apenas um item pode ser selecionado.
    - **Exemplo:**
        
        ```html
        <ul aria-multiselectable="true">
          <li>Opção 1</li>
          <li>Opção 2</li>
        </ul>
        
        ```
        
30. **aria-orientation**
    - **Descrição:** Especifica a orientação (horizontal ou vertical) de um widget.
    - **Possíveis Valores:**
        - **"horizontal":** Disposição em linha.
        - **"vertical":** Disposição em coluna.
    - **Exemplo:**
        
        ```html
        <div aria-orientation="vertical">Menu Vertical</div>
        
        ```
        
31. **aria-owns**
    - **Descrição:** Estabelece uma relação de propriedade entre o elemento e outros elementos.
    - **Possíveis Valores:**
        - **Valor livre:** Lista de IDs (separados por espaço) dos elementos “possuídos”.
    - **Exemplo:**
        
        ```html
        <div aria-owns="item1 item2">
          Container que “possui” os itens
        </div>
        <div id="item1">Item 1</div>
        <div id="item2">Item 2</div>
        
        ```
        
32. **aria-placeholder**
    - **Descrição:** Fornece um texto de exemplo que descreve o valor esperado em um campo de entrada.
    - **Possíveis Valores:**
        - **Valor livre:** Qualquer string descritiva.
    - **Exemplo:**
        
        ```html
        <input type="text" aria-placeholder="Digite seu nome">
        
        ```
        
33. **aria-posinset**
    - **Descrição:** Indica a posição de um item dentro de um conjunto.
    - **Possíveis Valores:**
        - **Número:** Valor inteiro representando a posição.
    - **Exemplo:**
        
        ```html
        <li aria-posinset="1">Primeiro Item</li>
        
        ```
        
34. **aria-pressed**
    - **Descrição:** Utilizado em botões de alternância para indicar se estão pressionados.
    - **Possíveis Valores:**
        - **"true":** Botão pressionado.
        - **"false":** Botão não pressionado.
        - **"mixed":** Estado indeterminado/misto.
    - **Exemplo:**
        
        ```html
        <button aria-pressed="false">Botão Toggle</button>
        
        ```
        
35. **aria-readonly**
    - **Descrição:** Indica que um campo é somente leitura e não pode ser modificado pelo usuário.
    - **Possíveis Valores:**
        - **"true":** Somente leitura.
        - **"false":** Editável.
    - **Exemplo:**
        
        ```html
        <input type="text" aria-readonly="true" value="Valor fixo">
        
        ```
        
36. **aria-relevant**
    - **Descrição:** Define quais mudanças no conteúdo devem ser anunciadas por tecnologias assistivas.
    - **Possíveis Valores:**
        - **"additions":** Apenas adições são relevantes.
        - **"removals":** Apenas remoções são relevantes.
        - **"text":** Alterações no texto.
        - **"all":** Todas as mudanças.
        - (Também podem ser combinados com espaço, ex.: "additions text".)
    - **Exemplo:**
        
        ```html
        <div aria-relevant="additions text">Conteúdo dinâmico</div>
        
        ```
        
37. **aria-required**
    - **Descrição:** Indica que o preenchimento de um campo é obrigatório.
    - **Possíveis Valores:**
        - **"true":** Campo obrigatório.
        - **"false":** Não obrigatório.
    - **Exemplo:**
        
        ```html
        <input type="text" aria-required="true" placeholder="Campo obrigatório">
        
        ```
        
38. **aria-roledescription**
    - **Descrição:** Fornece uma descrição personalizada do papel do widget.
    - **Possíveis Valores:**
        - **Valor livre:** Uma descrição textual, como "controle de volume".
    - **Exemplo:**
        
        ```html
        <div role="slider" aria-roledescription="controle de volume">Volume</div>
        
        ```
        
39. **aria-rowcount**
    - **Descrição:** Informa o número total de linhas em uma tabela ou grid.
    - **Possíveis Valores:**
        - **Número:** Valor inteiro representando a quantidade de linhas.
    - **Exemplo:**
        
        ```html
        <table aria-rowcount="5">
          <!-- Linhas da tabela -->
        </table>
        
        ```
        
40. **aria-rowindex**
    - **Descrição:** Indica a posição (índice) de uma linha dentro de um conjunto.
    - **Possíveis Valores:**
        - **Número:** Valor inteiro representando a posição da linha.
    - **Exemplo:**
        
        ```html
        <tr aria-rowindex="1">
          <td>Dado da linha</td>
        </tr>
        
        ```
        
41. **aria-rowspan**
    - **Descrição:** Define quantas linhas uma célula de tabela abrange.
    - **Possíveis Valores:**
        - **Número:** Valor inteiro (por exemplo, "2" para duas linhas).
    - **Exemplo:**
        
        ```html
        <td aria-rowspan="2">Célula que abrange duas linhas</td>
        
        ```
        
42. **aria-selected**
    - **Descrição:** Indica se um item em uma lista, grid ou conjunto está selecionado.
    - **Possíveis Valores:**
        - **"true":** Selecionado.
        - **"false":** Não selecionado.
    - **Exemplo:**
        
        ```html
        <option aria-selected="true">Opção Selecionada</option>
        
        ```
        
43. **aria-setsize**
    - **Descrição:** Informa o número total de itens em um conjunto.
    - **Possíveis Valores:**
        - **Número:** Valor inteiro representando o total.
    - **Exemplo:**
        
        ```html
        <li aria-setsize="5">Item de uma lista de 5 elementos</li>
        
        ```
        
44. **aria-sort**
    - **Descrição:** Indica o estado de ordenação de uma coluna em uma tabela.
    - **Possíveis Valores:**
        - **"none":** Sem ordenação.
        - **"ascending":** Ordenação crescente.
        - **"descending":** Ordenação decrescente.
        - **"other":** Outro estado de ordenação.
    - **Exemplo:**
        
        ```html
        <th aria-sort="ascending">Cabeçalho Ordenado</th>
        
        ```
        
45. **aria-valuemax**
    - **Descrição:** Define o valor máximo para widgets que trabalham com valores numéricos.
    - **Possíveis Valores:**
        - **Número:** Valor numérico máximo permitido.
    - **Exemplo:**
        
        ```html
        <input type="range" aria-valuemax="100" value="50">
        
        ```
        
46. **aria-valuemin**
    - **Descrição:** Define o valor mínimo para widgets numéricos.
    - **Possíveis Valores:**
        - **Número:** Valor numérico mínimo permitido.
    - **Exemplo:**
        
        ```html
        <input type="range" aria-valuemin="0" value="50">
        
        ```
        
47. **aria-valuenow**
    - **Descrição:** Representa o valor atual de um widget numérico.
    - **Possíveis Valores:**
        - **Número:** Valor numérico atual.
    - **Exemplo:**
        
        ```html
        <input type="range" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
        
        ```
        
48. **aria-valuetext**
    - **Descrição:** Fornece uma descrição textual adicional para o valor atual de um widget.
    - **Possíveis Valores:**
        - **Valor livre:** Uma string descritiva (por exemplo, "75% completo").
    - **Exemplo:**
        
        ```html
        <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="75" aria-valuetext="75% completo">
          Progresso
        </div>
        
        ```
        

---