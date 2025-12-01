# Atributos Globais

1. **accesskey**
    - **Descrição:** Define uma tecla de atalho para ativar o elemento.
    - **Possíveis Valores:**
        - **Valor livre:** Normalmente um único caractere (por exemplo, "s" para salvar).
    - **Exemplo:**
        
        ```html
        <button accesskey="s">Salvar</button>
        
        ```
        
2. **autocapitalize**
    - **Descrição:** Sugere ao navegador como capitalizar o texto inserido.
    - **Possíveis Valores:**
        - **"none":** Não capitaliza.
        - **"sentences":** Capitaliza a primeira letra de cada sentença.
        - **"words":** Capitaliza a primeira letra de cada palavra.
        - **"characters":** Converte todos os caracteres em maiúsculas.
    - **Exemplo:**
        
        ```html
        <p autocapitalize="sentences">este texto será capitalizado.</p>
        
        ```
        
3. **class**
    - **Descrição:** Atribui uma ou mais classes CSS ao elemento.
    - **Possíveis Valores:**
        - **Valor livre:** Uma lista de nomes de classes separados por espaço.
    - **Exemplo:**
        
        ```html
        <div class="container destaque">Conteúdo</div>
        
        ```
        
4. **contenteditable**
    - **Descrição:** Define se o conteúdo do elemento pode ser editado pelo usuário.
    - **Possíveis Valores:**
        - **"true":** O elemento é editável.
        - **"false":** O elemento não é editável.
        - **Valor livre (herdado):** Se não definido, o comportamento é herdado do pai.
    - **Exemplo:**
        
        ```html
        <div contenteditable="true">Edite este texto</div>
        
        ```
        
5. **data-\**
    - **Descrição:** Permite armazenar dados personalizados no elemento.
    - **Possíveis Valores:**
        - **Valor livre:** Você define o nome após “data-” e o valor pode ser qualquer string.
    - **Exemplo:**
        
        ```html
        <div data-user="123" data-info="exemplo">Dados customizados</div>
        
        ```
        
6. **dir**
    - **Descrição:** Define a direção do texto.
    - **Possíveis Valores:**
        - **"ltr":** Texto da esquerda para a direita.
        - **"rtl":** Texto da direita para a esquerda.
        - **"auto":** O navegador decide a direção com base no conteúdo.
    - **Exemplo:**
        
        ```html
        <p dir="rtl">Texto da direita para a esquerda.</p>
        
        ```
        
7. **draggable**
    - **Descrição:** Define se o elemento pode ser arrastado.
    - **Possíveis Valores:**
        - **"true":** Elemento pode ser arrastado.
        - **"false":** Elemento não pode ser arrastado.
        - **"auto":** Comportamento determinado automaticamente pelo navegador.
    - **Exemplo:**
        
        ```html
        <img src="exemplo.jpg" draggable="true" alt="Exemplo de imagem arrastável">
        
        ```
        
8. **enterkeyhint**
    - **Descrição:** Sugere a ação a ser executada quando o usuário pressiona Enter em um campo de entrada.
    - **Possíveis Valores:**
        - **"enter":** Insere uma quebra de linha (em alguns contextos).
        - **"done":** Indica conclusão.
        - **"go":** Indica iniciar uma ação.
        - **"next":** Avança para o próximo campo.
        - **"previous":** Retorna ao campo anterior.
        - **"search":** Inicia uma pesquisa.
        - **"send":** Envia os dados.
    - **Exemplo:**
        
        ```html
        <input type="text" enterkeyhint="search" placeholder="Pesquisar...">
        
        ```
        
9. **hidden**
    - **Descrição:** Indica que o elemento não deve ser exibido.
    - **Possíveis Valores:**
        - **Booleano:** É um atributo booleano; sua presença indica “true” (não exibido), ausência indica “false”.
    - **Exemplo:**
        
        ```html
        <div hidden>Este conteúdo está oculto.</div>
        
        ```
        
10. **id**
    - **Descrição:** Define um identificador único para o elemento.
    - **Possíveis Valores:**
        - **Valor livre:** Qualquer string única dentro do documento.
    - **Exemplo:**
        
        ```html
        <section id="introducao">Introdução</section>
        
        ```
        
11. **inputmode**
    - **Descrição:** Sugere ao dispositivo o tipo de teclado a ser exibido para o usuário.
    - **Possíveis Valores:**
        - **"none":** Sem teclado.
        - **"text":** Teclado de texto padrão.
        - **"tel":** Teclado numérico para telefone.
        - **"url":** Teclado otimizado para URLs.
        - **"email":** Teclado otimizado para e-mail.
        - **"numeric":** Teclado numérico.
        - **"decimal":** Teclado numérico com separador decimal.
        - **"search":** Teclado otimizado para pesquisas.
    - **Exemplo:**
        
        ```html
        <input type="text" inputmode="numeric" placeholder="Apenas números">
        
        ```
        
12. **is**
    - **Descrição:** Especifica um elemento personalizado que estende um elemento HTML padrão (usado em web components).
    - **Possíveis Valores:**
        - **Valor livre:** O nome do elemento customizado (por exemplo, "custom-button").
    - **Exemplo:**
        
        ```html
        <button is="custom-button">Botão Personalizado</button>
        
        ```
        
13. **itemid**
    - **Descrição:** Define um identificador para um item ao usar microdados.
    - **Possíveis Valores:**
        - **Valor livre:** Geralmente uma URL ou identificador único.
    - **Exemplo:**
        
        ```html
        <div itemscope itemid="produto1">Produto com microdados</div>
        
        ```
        
14. **itemprop**
    - **Descrição:** Define uma propriedade de um item em microdados.
    - **Possíveis Valores:**
        - **Valor livre:** Nome da propriedade conforme o vocabulário utilizado.
    - **Exemplo:**
        
        ```html
        <span itemprop="name">Nome do Produto</span>
        
        ```
        
15. **itemref**
    - **Descrição:** Lista outros elementos (por seus IDs) que fazem parte do mesmo item de microdados.
    - **Possíveis Valores:**
        - **Valor livre:** Lista de IDs separados por espaço.
    - **Exemplo:**
        
        ```html
        <div itemscope itemref="descricao detalhes">
          <p id="descricao" itemprop="description">Descrição do item.</p>
          <p id="detalhes" itemprop="details">Detalhes do item.</p>
        </div>
        
        ```
        
16. **itemscope**
    - **Descrição:** Indica que o elemento contém informações de um item (inicia um bloco de microdados).
    - **Possíveis Valores:**
        - **Booleano:** A presença do atributo é suficiente; não requer valor.
    - **Exemplo:**
        
        ```html
        <div itemscope>Conteúdo com microdados</div>
        
        ```
        
17. **itemtype**
    - **Descrição:** Define o tipo do item para microdados, geralmente uma URL que especifica o vocabulário.
    - **Possíveis Valores:**
        - **Valor livre:** Uma URL, como "[http://schema.org/Product](http://schema.org/Product)".
    - **Exemplo:**
        
        ```html
        <div itemscope itemtype="<http://schema.org/Product>">
          <span itemprop="name">Produto Exemplo</span>
        </div>
        
        ```
        
18. **lang**
    - **Descrição:** Define o idioma do conteúdo do elemento.
    - **Possíveis Valores:**
        - **Valor livre:** Código de idioma, como "en", "pt-BR", etc.
    - **Exemplo:**
        
        ```html
        <p lang="en">This text is in English.</p>
        
        ```
        
19. **nonce**
    - **Descrição:** Usado para permitir que scripts e estilos inline sejam executados em páginas com CSP (Content Security Policy) ativa.
    - **Possíveis Valores:**
        - **Valor livre:** Uma string única (por exemplo, "abc123") que deve corresponder à política do servidor.
    - **Exemplo:**
        
        ```html
        <script nonce="abc123">console.log('Script seguro');</script>
        
        ```
        
20. **role**
    - **Descrição:** Define o papel do elemento na aplicação, auxiliando tecnologias assistivas.
    - **Possíveis Valores:**
        - **Valor livre:** Nomes de papéis predefinidos (por exemplo, "button", "navigation", "dialog", etc.).
    - **Exemplo:**
        
        ```html
        <nav role="navigation">Menu de Navegação</nav>
        
        ```
        
21. **slot**
    - **Descrição:** Nomeia um slot para a distribuição de conteúdo em web components com Shadow DOM.
    - **Possíveis Valores:**
        - **Valor livre:** Uma string identificadora, como "header".
    - **Exemplo:**
        
        ```html
        <div slot="header">Cabeçalho para componente customizado</div>
        
        ```
        
22. **spellcheck**
    - **Descrição:** Indica se a verificação ortográfica deve ser ativada para o elemento.
    - **Possíveis Valores:**
        - **"true":** Ativa a verificação.
        - **"false":** Desativa a verificação.
    - **Exemplo:**
        
        ```html
        <p spellcheck="true">Verifique a ortografia deste texto.</p>
        
        ```
        
23. **style**
    - **Descrição:** Permite aplicar estilos CSS inline ao elemento.
    - **Possíveis Valores:**
        - **Valor livre:** Qualquer declaração CSS válida.
    - **Exemplo:**
        
        ```html
        <div style="color: red; font-weight: bold;">Texto estilizado</div>
        
        ```
        
24. **tabindex**
    - **Descrição:** Define a ordem de tabulação para navegação com a tecla Tab.
    - **Possíveis Valores:**
        - **Número (como string):** Valores numéricos inteiros (por exemplo, "0", "1", "-1").
            - **0:** Elemento incluído na ordem natural do documento.
            - **Número positivo:** Ordem personalizada (não recomendado em larga escala).
            - **1:** Elemento focável, mas não via Tab.
    - **Exemplo:**
        
        ```html
        <a href="#" tabindex="0">Link com tabulação definida</a>
        
        ```
        
25. **title**
    - **Descrição:** Fornece informações adicionais sobre o elemento (exibidas como tooltip).
    - **Possíveis Valores:**
        - **Valor livre:** Qualquer string que descreva o elemento.
    - **Exemplo:**
        
        ```html
        <span title="Informação extra">Passe o mouse aqui</span>
        
        ```
        
26. **translate**
    - **Descrição:** Sugere se o conteúdo do elemento deve ser traduzido automaticamente.
    - **Possíveis Valores:**
        - **"yes":** Indica que o conteúdo pode ser traduzido.
        - **"no":** Indica que o conteúdo não deve ser traduzido.
    - **Exemplo:**
        
        ```html
        <p translate="no">Este texto não será traduzido.</p>
        
        ```
        
27. **inert** (experimental)
    - **Descrição:** Indica que o elemento deve ser ignorado por tecnologias assistivas e não deve interagir com o usuário.
    - **Possíveis Valores:**
        - **Booleano:** A presença do atributo o torna “inerte” (não interativo).
    - **Exemplo:**
        
        ```html
        <div inert>Este conteúdo está inativo para interações e leitores de tela.</div>
        
        ```
        

---