# Lista de decorators

Certo, Gedê. Se você deseja uma lista mais completa, vamos detalhar os decorators, incluindo os de nicho e os menos comuns, para que você tenha uma referência exaustiva.

---

## Decorators de Classe

Aplicados na declaração de uma classe, eles a definem como um tipo específico para o sistema do Angular.

- `@Component()`: O mais fundamental, marca uma classe como um componente e fornece metadados de configuração, como `selector`, `templateUrl` e `styleUrls`.
- `@Directive()`: Marca uma classe como uma diretiva, usada para adicionar comportamento a elementos do DOM.
- `@Pipe()`: Marca uma classe como um pipe, utilizado para transformar dados no template.
- `@Injectable()`: Marca uma classe como um serviço que pode ser injetado no construtor de outras classes.
- `@NgModule()`: Marca uma classe como um módulo Angular, configurando quais componentes, diretivas e pipes ele agrupa.
- `@CustomElement()`: Utilizado para registrar um componente Angular como um *Custom Element* (Web Component), permitindo que ele seja usado em qualquer aplicação web, mesmo fora do Angular.

---

## Decorators de Propriedade

Esses decorators são aplicados a propriedades dentro de uma classe, modificando seu comportamento.

- `@Input()`: Define uma propriedade de um componente ou diretiva como um dado de entrada, permitindo a comunicação de pai para filho.
- `@Output()`: Define uma propriedade para emitir eventos de um componente ou diretiva, geralmente usando um `EventEmitter`, permitindo a comunicação de filho para pai.
- `@ViewChild()`: Recupera a primeira correspondência de um elemento, componente ou diretiva do DOM dentro do próprio template do componente.
- `@ViewChildren()`: Recupera todas as correspondências do DOM dentro do próprio template do componente, retornando uma `QueryList`.
- `@ContentChild()`: Recupera a primeira correspondência de um elemento, componente ou diretiva que foi projetado no componente via `<ng-content>`.
- `@ContentChildren()`: Recupera todas as correspondências projetadas no componente, retornando uma `QueryList`.
- `@HostBinding()`: Associa uma propriedade de uma classe a uma propriedade do elemento host (o elemento HTML onde a diretiva ou componente está aplicado).
- `@HostListener()`: Escuta eventos no elemento host e executa um método em resposta.

---

## Decorators de Parâmetro do Construtor

Esses decorators modificam como o sistema de injeção de dependência do Angular resolve os parâmetros de um construtor.

- `@Inject()`: Permite a injeção manual de dependências usando um token, o que é útil para injetar valores não-classe (como strings ou objetos de configuração).
- `@Self()`: Limita a busca por uma dependência ao injetor do próprio componente.
- `@SkipSelf()`: Faz com que o injetor pule o injetor do componente atual e procure a dependência a partir do injetor pai.
- `@Host()`: Limita a busca por uma dependência ao injetor do elemento host e seus pais, sem buscar em injetores mais altos na árvore de componentes.
- `@Optional()`: Marca uma dependência como opcional. Se a dependência não for encontrada, o Angular injeta `null` em vez de lançar um erro.
- `@Attribute()`: Usado para injetar o valor de um atributo HTML estático no construtor de uma diretiva.

---

## Decorators para a `Router`

Decorators específicos que podem ser usados para obter informações relacionadas à rota.

- `@Resolve()`: Usado no contexto de roteamento para pré-carregar dados antes que um componente seja ativado. No entanto, este decorator é mais comum em versões mais antigas do Angular, e a abordagem preferida hoje em dia é usar as funções de `resolve` diretamente nas configurações de rota.

Essa lista é a mais completa que você pode precisar. Ela inclui todos os decorators principais e os de casos mais específicos, fornecendo um panorama total de como eles são usados no framework.