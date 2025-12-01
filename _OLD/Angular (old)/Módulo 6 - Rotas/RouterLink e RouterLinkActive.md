Angular oferece um conjunto robusto de ferramentas para criar aplicações de página única (Single Page Applications - SPAs), com um sistema de roteamento poderoso que permite a navegação entre diferentes componentes sem a necessidade de recarregar a página. Duas diretivas essenciais nesse sistema são `RouterLink` e `RouterLinkActive`. Vamos explorar em detalhes o que são, para que servem, suas sintaxes e como aplicar CSS em rotas ativas.

## O que é e para que serve?

### RouterLink

`RouterLink` é uma diretiva usada para navegar entre as páginas de uma aplicação Angular. Ela permite que você vincule um elemento HTML a uma rota específica, tornando-o clicável e capaz de direcionar o usuário para outro componente sem recarregar a página. Essa é uma parte fundamental do sistema de roteamento do Angular, pois simplifica a criação de links navegáveis na sua aplicação.

### RouterLinkActive

`RouterLinkActive` é uma diretiva que funciona em conjunto com `RouterLink`, usada para adicionar automaticamente uma classe CSS a um elemento quando a rota associada a esse elemento está ativa. Isso é particularmente útil para destacar o link da página atual no menu de navegação, melhorando a experiência do usuário ao fornecer um feedback visual da página em que ele se encontra.

## Sintaxe

### RouterLink

A sintaxe básica de `RouterLink` é simples e direta. Ela é usada dentro de um atributo de um elemento HTML, como um `<a>`, `<button>`, ou qualquer outro elemento que você queira tornar clicável. O valor do atributo `routerLink` é o caminho da rota para a qual você deseja navegar.

```html
<!-- Navegação com texto -->
<a routerLink="/pagina-destino">Ir para a Página Destino</a>

<!-- Navegação com parâmetros -->
<a [routerLink]="['/usuario', usuarioId]">Perfil do Usuário</a>
```

### RouterLinkActive

Para usar `RouterLinkActive`, você simplesmente adiciona a diretiva ao mesmo elemento que possui `RouterLink`, ou a um elemento pai, e especifica a classe CSS que deseja aplicar quando a rota estiver ativa.

```html
<!-- Aplicando a classe 'active' quando a rota está ativa -->
<nav>
  <a routerLink="/home" routerLinkActive="active">Home</a>
  <a routerLink="/about" routerLinkActive="active">About</a>
</nav>
```

Você também pode aplicar `RouterLinkActive` a um elemento pai para controlar o estado ativo de múltiplos links.

```html
<nav routerLinkActive="active" #rla="routerLinkActive">
  <a routerLink="/home">Home</a>
  <a routerLink="/about">About</a>
  <div *ngIf="rla.isActive">Uma das rotas acima está ativa!</div>
</nav>
```

## Aplicando CSS em Rotas Ativas

Para estilizar elementos com base em sua atividade, você define uma classe CSS que deseja aplicar e a especifica no atributo `routerLinkActive`. A classe é automaticamente adicionada ao elemento quando a rota associada está ativa, permitindo que você aplique estilos específicos.

```css
/* CSS para a classe 'active' */
.active {
  color: red;
  font-weight: bold;
}
```

Combinando `routerLink` e `routerLinkActive`, você pode criar uma navegação visualmente responsiva que destaca o link da página atual, melhorando significativamente a usabilidade da sua aplicação Angular.

## Exemplo Completo

```html
<!-- app.component.html -->
<nav>
  <a routerLink="/home" routerLinkActive="active">Home</a>
  <a routerLink="/about" routerLinkActive="active">About</a>
  <a routerLink="/contact" routerLinkActive="active">Contact</a>
</nav>
<router-outlet></router-outlet>
```

```css
/* app.component.css */
nav a.active {
  color: blue;
  text-decoration: underline;
}
```

Este exemplo cria um menu de navegação com três links. Quando o usuário clica em um link, a classe `active` é aplicada, alterando a cor e adicionando um sublinhado ao texto, destacando visualmente a página atual.

## Conclusão

`RouterLink` e `RouterLinkActive` são ferramentas essenciais no desenvolvimento de aplicações Angular, simplificando a navegação entre componentes e melhorando a experiência do usuário com feedback visual claro. A combinação dessas diretivas com estilos CSS permite criar interfaces de usuário ricas e intuitivas, essenciais para aplicações SPA modernas.