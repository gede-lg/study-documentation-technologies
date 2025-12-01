# Rotas no Angular

O sistema de rotas do Angular é uma parte integral do framework que permite a implementação de navegação entre diferentes vistas dentro de uma aplicação de página única (SPA - Single Page Application). Este sistema é projetado para simular a navegação tradicional do navegador, apesar de a aplicação ser carregada em uma única página. Vamos explorar em detalhes o que são as rotas no Angular, para que servem, a aplicação SPA, e o papel do `router-outlet`.

## O que é e para que serve?

No Angular, uma **rota** é definida como uma associação entre um caminho de URL específico e um componente. Essa associação permite que o Angular exiba diferentes componentes com base na URL acessada pelo usuário, sem a necessidade de recarregar a página. O sistema de rotas é essencial para construir SPAs, pois permite uma navegação fluida e eficiente entre as "páginas" ou vistas da aplicação.

### Aplicação SPA

Uma **SPA (Single Page Application)** é uma aplicação web que carrega uma única página HTML e, em seguida, atualiza o conteúdo dinamicamente em resposta às ações do usuário. Isso é conseguido através do uso de JavaScript, CSS, e, em nosso caso, o framework Angular. As SPAs oferecem uma experiência de usuário semelhante a uma aplicação desktop, com tempos de carregamento mais rápidos e uma navegação mais suave, pois os recursos são carregados uma única vez, e apenas novos dados são buscados conforme necessário.

### Router-outlet

O **`<router-outlet>`** é um diretiva do Angular que atua como um placeholder que Angular dinamicamente preenche com base na rota atual. Quando o Angular inicia o processo de navegação, ele decide qual componente deve ser mostrado com base na URL atual e então renderiza esse componente dentro do `router-outlet`.