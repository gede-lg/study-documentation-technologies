# *, ng-template e [template]

E aí, Gedê\! A.R.I.A. aqui de novo pra desmistificar a relação entre esses jeitos de usar as diretivas estruturais no Angular. Essa é uma parte importante da "mágica" do Angular que, como desenvolvedor, você vai curtir entender\!

---

## Desvendando o , `<ng-template>` e o Atributo `template` nas Diretivas Estruturais

A confusão entre o asterisco (`*`), a tag `<ng-template>` e o atributo `template` é super comum, mas entender a relação entre eles é fundamental para dominar as **diretivas estruturais** do Angular, como o `*ngIf`, `*ngFor` e `*ngSwitchCase`. Basicamente, o `*` é uma forma simplificada (açúcar sintático) de usar o `<ng-template>`, que é a forma fundamental como o Angular lida com a manipulação do DOM.

Vamos mergulhar nessa relação:

### 1\. O Asterisco () nas Diretivas Estruturais: Açúcar Sintático

Quando você vê um asterisco (`*`) antes do nome de uma diretiva (ex: `*ngIf`, `*ngFor`), ele não é apenas um caractere; ele é um atalho. O Angular interpreta esse asterisco e, por baixo dos panos, **transforma o elemento HTML onde a diretiva está aplicada em um elemento `<ng-template>`**.

**Como funciona a transformação:**

Considere este exemplo simples com `*ngIf`:

```html
<p *ngIf="condicao">Este parágrafo aparece se a condição for verdadeira.</p>

```

O Angular, em tempo de compilação, converte essa linha para algo semelhante a isto:

```html
<ng-template [ngIf]="condicao">
  <p>Este parágrafo aparece se a condição for verdadeira.</p>
</ng-template>

```

Percebeu? O elemento `<p>` original se tornou o conteúdo interno do `<ng-template>`, e a diretiva `ngIf` (sem o `*`) foi aplicada diretamente ao `<ng-template>` como uma **binding de propriedade** (`[ngIf]`).

**Por que existe o `*`?**

Para simplificar a escrita do código HTML. É muito mais legível e rápido escrever `*ngIf` do que ter que envolver cada elemento em um `<ng-template>` manualmente. Ele esconde a complexidade de como o Angular manipula a árvore do DOM.

### 2\. A Tag `<ng-template>`: O Coração da Diretiva Estrutural

A tag `<ng-template>` é um elemento especial do Angular. Ao contrário de outras tags HTML, ela **não é renderizada diretamente no DOM**. Em vez disso, ela serve como um "molde" ou um "contêiner" para um pedaço de HTML. O Angular usa o conteúdo de um `<ng-template>` para criar e inserir elementos no DOM dinamicamente, com base nas condições da diretiva estrutural associada.

**Função Principal:**

- **Conteúdo a ser Renderizado Condicionalmente/Repetidamente:** O HTML dentro de um `<ng-template>` só é adicionado ao DOM se a diretiva estrutural associada decidir que deve ser.
- **Não é um Elemento DOM:** Ele não se torna um nó no DOM, o que o torna eficiente para agrupar conteúdo sem introduzir elementos extras na sua estrutura.

**Quando usar explicitamente `<ng-template>`?**

Você usará a tag `<ng-template>` diretamente em situações onde o açúcar sintático do `*` não é suficiente ou não se encaixa, como:

- **Cláusulas `else` ou `then` do `ngIf`:**
    
    ```html
    <div *ngIf="isLoggedIn; else loggedOutContent">
      Bem-vindo, Gedê!
    </div>
    <ng-template #loggedOutContent>
      Por favor, faça login.
    </ng-template>
    
    ```
    
    Aqui, `loggedOutContent` é um `<ng-template>` que só será renderizado se `isLoggedIn` for falso.
    
- **Múltiplas Diretivas Estruturais:** Como você não pode ter dois  no mesmo elemento (`ngIf` e `ngFor` juntos, por exemplo), você usa `<ng-container>` (que por sua vez usa `<ng-template>` internamente) ou aninha `<ng-template>`s.
    
    ```html
    <ng-container *ngFor="let item of items">
      <ng-template *ngIf="item.visible">
        <p>{{ item.nome }}</p>
      </ng-template>
    </ng-container>
    
    ```
    

### 3\. O Atributo `template`: A Forma Antiga (e Obsoleta)

Antigamente, nas versões mais iniciais do Angular (e em frameworks anteriores como AngularJS), era comum ver um atributo chamado `template` em algumas tags HTML para definir blocos de conteúdo que seriam manipulados por diretivas.

**Exemplo (apenas para contexto histórico, não use\!):**

```html
<div template="ngIf condicao">
  Este div seria renderizado.
</div>

```

**Por que não usamos mais?**

Essa abordagem foi substituída pela sintaxe com o asterisco (`*`) e pela tag `<ng-template>` por algumas razões:

- **Clareza e Consistência:** A sintaxe  é mais alinhada com as convenções modernas do Angular e é mais fácil de entender visualmente.
- **Separação de Preocupações:** O atributo `template` misturava a definição da diretiva com a indicação de que o conteúdo era um template, o que não era tão claro.
- **Flexibilidade:** O `<ng-template>` oferece mais flexibilidade e controle sobre como e onde o conteúdo do template é renderizado, especialmente com as referências de template (`#`).

---

### Resumo da Relação

Pense assim, Gedê:

- O  **(asterisco)** é a **forma mais conveniente e moderna** de aplicar uma diretiva estrutural. Ele é um atalho sintático que o Angular converte.
- O **`<ng-template>`** é a **forma fundamental e explícita** de definir um bloco de HTML que o Angular pode renderizar dinamicamente. É o que o  se transforma por baixo dos panos.
- O **atributo `template`** é uma **abordagem obsoleta** que não é mais usada no Angular moderno para diretivas estruturais.

Com essa compreensão, você não só vai usar as diretivas estruturais de forma mais eficaz, como também vai conseguir "ler" o código Angular com mais profundidade.

Se tiver mais alguma dúvida sobre isso, Gedê, pode perguntar\!