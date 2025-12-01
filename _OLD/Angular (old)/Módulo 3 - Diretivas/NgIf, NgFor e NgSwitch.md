### NgIf

#### O que é

`NgIf` é uma diretiva estrutural em Angular que é usada para adicionar ou remover um elemento do DOM com base em uma condição específica. Se a condição é verdadeira, o elemento é adicionado ao DOM; se é falsa, o elemento é removido.

#### Sintaxe de uso

```html
<!--Antigo (até o 16)-->
<div *ngIf="condicao; else elseBlock">Conteúdo a ser exibido se a condição for verdadeira.</div>
<ng-template #elseBlock>Conteúdo a ser exibido se a condição for falsa.</ng-template>

<!--Novo (depois do 17)-->
	@if (condição){
		Bloco 1
	} @else if(condição 2) {
		Bloco 2
	} @else {
		Caso nenhuma cosdição seja Satisfeita!
	}
```

- `condicao` é uma expressão que retorna um valor booleano.
- `else elseBlock` é opcional e especifica um template a ser exibido quando a condição é falsa.

#### Exemplo

```html
<p *ngIf="user.isLoggedIn">Bem-vindo, {{ user.name }}!</p>
<p *ngIf="!user.isLoggedIn; else loggedOut">Carregando...</p>
<ng-template #loggedOut>Você não está logado.</ng-template>
```

### NgFor

#### O que é

`NgFor` é uma diretiva estrutural que repete um template para cada item de uma lista. É semelhante a loops em linguagens de programação, permitindo renderizar dinamicamente uma lista de elementos no DOM.

#### Sintaxe de uso

```html
<!--Antigo (até o 16)-->
<div *ngFor="let item of items; let i = index; let even = even; let odd = odd">
  {{ i + 1 }} - {{ item.nome }} ({{ even ? 'Par' : 'Ímpar' }})
</div>

<!--Antigo (depois do 17)-->
	@for (conteudo of lista; track $index) {
		<li>{{ conteudo }}</li>
	} @empty { 
		<p>Preencha a lista para visualizar itens!</p>
	}
```

- `items` é a lista de dados a ser iterada.
- `let item of items` declara uma variável local `item` para cada item da lista.
- `let i = index` é opcional e atribui o índice atual do item na lista à variável `i`.
- `let even = even` e `let odd = odd` são opcionais e atribuem valores booleanos indicando se o item está em uma posição par ou ímpar.

#### Exemplo

```html
<ul>
  <li *ngFor="let user of users; let i = index">
    {{ i + 1 }} - {{ user.name }}
  </li>
</ul>
```

### NgSwitch

#### O que é

`NgSwitch` é uma diretiva que exibe um dos muitos possíveis elementos com base em uma condição. Funciona de maneira semelhante a uma instrução switch em linguagens de programação, onde com base no valor de uma expressão, um bloco de código específico é executado.

#### Sintaxe de uso

```html
	<div [ngSwitch]="expressao">
	  <div *ngSwitchCase="'valor1'">Conteúdo para valor1</div>
	  <div *ngSwitchCase="'valor2'">Conteúdo para valor2</div>
	  <div *ngSwitchDefault>Conteúdo padrão</div>
	</div>


	@switch (nivelEstudante) {
		@case ('iniciante') {
			<p> Comece por HTML, CSS e JS </p>
		} @case ('intermediario') {
			<p> Escolha seu framework! </p>
		} @default {
			<p> Vamos estudar? </p>
		}
	}
```

- `[ngSwitch]` é aplicado a um container, que avalia a expressão.
- `*ngSwitchCase` define o conteúdo para um valor específico da expressão.
- `*ngSwitchDefault` é opcional e define o conteúdo a ser exibido quando nenhum caso corresponde.

#### Exemplo

```html
<div [ngSwitch]="user.role">
  <p *ngSwitchCase="'admin'">Painel de Administração</p>
  <p *ngSwitchCase="'user'">Painel do Usuário</p>
  <p *ngSwitchDefault>Por favor, faça login.</p>
</div>
```

### Considerações Finais

- **Uso Prático:** Essas diretivas tornam o desenvolvimento com Angular muito mais flexível e poderoso, permitindo construir aplicações dinâmicas e reativas com facilidade.
- **Boas Práticas:** Ao usar essas diretivas, é importante manter o código organizado e evitar expressões muito complexas diretamente nos templates para manter a legibilidade e a manutenibilidade do código.
- **Performance:** Angular otimiza internamente o uso dessas diretivas para garantir uma boa performance, mas é

 importante estar ciente do custo de re-renderizações frequentes, especialmente com `NgFor` em listas grandes ou complexas.

Combinando essas diretivas de maneira eficaz, você pode criar interfaces de usuário ricas e interativas que respondem às ações do usuário e às mudanças de estado da aplicação de maneira fluida e natural.