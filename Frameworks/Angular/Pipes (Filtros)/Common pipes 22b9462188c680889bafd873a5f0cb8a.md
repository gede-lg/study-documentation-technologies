# Common pipes

## Pipes no Angular: Transformando Dados de Forma Simples e Eficiente

Pipes no Angular são uma ferramenta poderosa para transformar dados exibidos em templates HTML. Eles permitem formatar, filtrar e organizar informações de maneira declarativa, sem a necessidade de escrever lógica complexa diretamente nos componentes. Essa funcionalidade é crucial para manter o código limpo, legível e de fácil manutenção, pois separa a preocupação da apresentação dos dados da lógica de negócios.

Basicamente, um pipe recebe um valor de entrada, o transforma e retorna um valor de saída. Isso é extremamente útil para exibir datas em formatos específicos, moedas com símbolos e casas decimais corretas, textos em maiúsculas ou minúsculas, entre outras transformações comuns.

---

## Sumário

- **O que são Pipes no Angular**
    - Definição e Conceitos Fundamentais
- **Common Pipes (Pipes Padrão)**
    - Sintaxe e Estrutura Detalhada de Cada Pipe
    - Principais Pipes e suas Funções
        - `DatePipe`
        - `CurrencyPipe`
        - `DecimalPipe`
        - `PercentPipe`
        - `JsonPipe`
        - `AsyncPipe`
        - `SlicePipe`
        - `LowerCasePipe`
        - `UpperCasePipe`
        - `TitleCasePipe`
        - `I18nPluralPipe`
        - `I18nSelectPipe`
        - `KeyValuePipe`
- **Restrições de Uso**
- **Exemplos de Código Otimizados**
- **Informações Adicionais**
    - Prós e Contras dos Pipes
    - Quando Utilizar e Quando Evitar
- **Referências para Estudo Independente**

---

## Conteúdo Detalhado

### O que são Pipes no Angular

Pipes são funções que você pode usar em expressões de template para transformar dados antes de exibi-los. Eles funcionam como um filtro, permitindo que você adapte a apresentação dos dados sem alterar o modelo de dados original. O Angular já oferece um conjunto de pipes embutidos, conhecidos como **Common Pipes**, que cobrem as necessidades mais frequentes de formatação.

A principal vantagem dos pipes é a **reusabilidade e a separação de responsabilidades**. Em vez de ter que formatar uma data em cada lugar que ela é exibida, você pode simplesmente usar o `DatePipe`, e ele cuidará da formatação para você.

### Common Pipes (Pipes Padrão)

### Sintaxe e Estrutura Detalhada de Cada Pipe

A sintaxe básica para usar um pipe em um template Angular é: `{{ valor | nomeDoPipe:arg1:arg2:... }}`. Agora, vamos detalhar os argumentos específicos para cada um.

- `DatePipe`
    - **Propósito:** Formata um valor de data.
    - **Sintaxe:** `{{ valorData | date [ : format [ : timezone [ : locale ] ] ] }}`
    - **Argumentos:**
        - `format` (string, opcional): Define o formato da data. Exemplos: `'short'`, `'longDate'`, `'dd/MM/yyyy'`. Padrão: `'mediumDate'`.
        - `timezone` (string, opcional): Define o fuso horário. Exemplos: `'GMT'`, `'+0300'`, `'America/New_York'`. Padrão: fuso horário local.
        - `locale` (string, opcional): Define o locale para formatação (ex: `'en-US'`, `'pt-BR'`). Padrão: o locale da aplicação.
    - **Exemplo:** `{{ dataAtual | date:'dd/MM/yyyy HH:mm' }}`
- `CurrencyPipe`
    - **Propósito:** Transforma um número em uma string de moeda.
    - **Sintaxe:** `{{ valorNumerico | currency [ : currencyCode [ : display [ : digitsInfo [ : locale ] ] ] ] }}`
    - **Argumentos:**
        - `currencyCode` (string, opcional): O código ISO 4217 da moeda (ex: `'USD'`, `'BRL'`, `'EUR'`). Padrão: `'USD'`.
        - `display` (string | boolean, opcional): Como exibir o símbolo da moeda. `'symbol'` (padrão), `'symbol-narrow'`, `'code'`, `true` (usa o símbolo), `false` (não exibe o símbolo).
        - `digitsInfo` (string, opcional): Define o formato dos dígitos (mínimo de inteiros, mínimo de decimais, máximo de decimais). Ex: `'1.2-2'` (1 inteiro, 2-2 decimais).
        - `locale` (string, opcional): O locale. Padrão: o locale da aplicação.
    - **Exemplo:** `{{ 123.45 | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}`
- `DecimalPipe`
    - **Propósito:** Formata um número com um número específico de casas decimais.
    - **Sintaxe:** `{{ valorNumerico | number [ : digitsInfo [ : locale ] ] }}`
    - **Argumentos:**
        - `digitsInfo` (string, opcional): Define o formato dos dígitos (mínimo de inteiros, mínimo de decimais, máximo de decimais). Ex: `'1.0-2'` (1 inteiro, 0-2 decimais). Padrão: `'1.0-3'`.
        - `locale` (string, opcional): O locale. Padrão: o locale da aplicação.
    - **Exemplo:** `{{ 12345.678 | number:'1.2-2' }}`
- `PercentPipe`
    - **Propósito:** Transforma um número em uma string percentual. O número de entrada é multiplicado por 100 antes da formatação.
    - **Sintaxe:** `{{ valorNumerico | percent [ : digitsInfo [ : locale ] ] }}`
    - **Argumentos:**
        - `digitsInfo` (string, opcional): Define o formato dos dígitos (mínimo de inteiros, mínimo de decimais, máximo de decimais). Ex: `'1.0-2'` (1 inteiro, 0-2 decimais). Padrão: `'1.0-3'`.
        - `locale` (string, opcional): O locale. Padrão: o locale da aplicação.
    - **Exemplo:** `{{ 0.7654 | percent:'1.0-2' }}`
- `JsonPipe`
    - **Propósito:** Converte um objeto JavaScript em uma string JSON formatada.
    - **Sintaxe:** `{{ valorObjeto | json }}`
    - **Argumentos:** Nenhum.
    - **Exemplo:** `<pre>{{ meuObjeto | json }}</pre>`
- `AsyncPipe`
    - **Propósito:** Inscreve-se em um `Observable` ou `Promise` e retorna o último valor emitido. Gerencia automaticamente a inscrição e desinscrição.
    - **Sintaxe:** `{{ observableOuPromise | async }}`
    - **Argumentos:** Nenhum.
    - **Exemplo:** `{{ dadosObservable | async }}`
- `SlicePipe`
    - **Propósito:** Cria uma nova fatia de um `Array` ou `String`.
    - **Sintaxe:** `{{ valor | slice [ : start [ : end ] ] }}`
    - **Argumentos:**
        - `start` (number, opcional): O índice inicial da fatia. Se negativo, especifica o deslocamento do final da sequência. Padrão: `0`.
        - `end` (number, opcional): O índice final da fatia (não inclusivo). Se negativo, especifica o deslocamento do final da sequência. Se omitido, a fatia vai até o final.
    - **Exemplo:** `{{ minhaLista | slice:1:3 | json }}` (pega o segundo e terceiro elementos)
- `LowerCasePipe`
    - **Propósito:** Transforma o texto em minúsculas.
    - **Sintaxe:** `{{ texto | lowercase }}`
    - **Argumentos:** Nenhum.
    - **Exemplo:** `{{ 'MEU TEXTO' | lowercase }}`
- `UpperCasePipe`
    - **Propósito:** Transforma o texto em maiúsculas.
    - **Sintaxe:** `{{ texto | uppercase }}`
    - **Argumentos:** Nenhum.
    - **Exemplo:** `{{ 'meu texto' | uppercase }}`
- `TitleCasePipe`
    - **Propósito:** Transforma o texto, capitalizando a primeira letra de cada palavra.
    - **Sintaxe:** `{{ texto | titlecase }}`
    - **Argumentos:** Nenhum.
    - **Exemplo:** `{{ 'este é um exemplo' | titlecase }}`
- `I18nPluralPipe`
    - **Propósito:** Exibe uma string diferente com base em um valor numérico, seguindo regras de pluralização. Essencial para internacionalização.
    - **Sintaxe:** `{{ valorNumerico | i18nPlural: mapping }}`
    - **Argumentos:**
        - `mapping` (objeto JavaScript, obrigatório): Um mapa de strings para diferentes quantidades. As chaves podem ser `='número'` (para uma quantidade exata), ou categorias de pluralização como `'zero'`, `'one'`, `'two'`, `'few'`, `'many'`, `'other'`. O valor associado pode conter `#` como placeholder para o número.
    - **Exemplo:** `{{ contador | i18nPlural: {'=0': 'Nenhum item', '=1': 'Um item', 'other': '# itens'} }}`
- `I18nSelectPipe`
    - **Propósito:** Exibe uma string diferente com base em um valor de seleção. Usado para traduções condicionais.
    - **Sintaxe:** `{{ valorSelecao | i18nSelect: mapping }}`
    - **Argumentos:**
        - `mapping` (objeto JavaScript, obrigatório): Um mapa onde as chaves são os valores de seleção (ex: `'male'`, `'female'`, `'other'`) e os valores são as strings a serem exibidas. Inclua sempre uma chave `'other'` para o valor padrão.
    - **Exemplo:** `{{ genero | i18nSelect: {'male': 'Bem-vindo, Sr.', 'female': 'Bem-vinda, Sra.', 'other': 'Bem-vindo(a)'} }}`
- `KeyValuePipe`
    - **Propósito:** Transforma um objeto ou `Map` em um array de objetos `KeyValue` (com propriedades `key` e `value`), permitindo a iteração com `ngFor`.
    - **Sintaxe:** `{{ objetoOuMap | keyvalue [ : compareFn ] }}`
    - **Argumentos:**
        - `compareFn` (função, opcional): Uma função de comparação personalizada para ordenar o array resultante. A função recebe dois argumentos `KeyValue` e deve retornar um número negativo se o primeiro for menor, positivo se for maior, e zero se forem iguais.
    - **Exemplo:**
    Com ordenação:
        
        ```html
        <li *ngFor="let entry of meuObjeto | keyvalue">
          {{ entry.key }}: {{ entry.value }}
        </li>
        
        ```
        
        ```tsx
        // No componente
        ordenarPorChave(a: KeyValue<string, any>, b: KeyValue<string, any>): number {
          return a.key.localeCompare(b.key);
        }
        // No template
        <li *ngFor="let entry of meuObjeto | keyvalue:ordenarPorChave">
          {{ entry.key }}: {{ entry.value }}
        </li>
        
        ```
        

---

## Exemplos de Código Otimizados

Os exemplos de código que te passei anteriormente já contemplam a utilização de cada pipe com seus argumentos. Você pode revisitar a seção "Exemplos de Código Otimizados" para ver como a sintaxe de cada um se aplica na prática.

---

## Informações Adicionais

### Prós e Contras dos Pipes

**Prós:**

- **Reusabilidade:** Evita a duplicação de código de formatação.
- **Legibilidade:** Mantém o template HTML mais limpo e fácil de entender.
- **Performance:** Pipes puros (aqueles que dependem apenas das entradas para produzir saídas) são executados apenas quando a entrada muda, otimizando a performance.
- **Localização:** Muitos pipes padrão suportam formatação baseada na localização, facilitando a internacionalização da aplicação, como é o caso dos `I18nPluralPipe` e `I18nSelectPipe`.
- **Separar Preocupações:** Permite separar a lógica de apresentação da lógica do componente.

**Contras:**

- **Debugging:** Pode ser um pouco mais complicado depurar problemas de formatação que ocorrem dentro de pipes complexos ou encadeados.
- **Pipes Impuros:** Pipes impuros (aqueles que são executados a cada ciclo de detecção de mudanças, independentemente da entrada) podem impactar a performance se usados indiscriminadamente. O `AsyncPipe` e o `KeyValuePipe` são exemplos de pipes impuros. Embora úteis, seu uso constante com objetos que mudam frequentemente pode levar a re-renderizações desnecessárias. É crucial entender seu comportamento para otimizar a performance.
- **Limitações de Lógica Complexa:** Para transformações muito complexas ou que exigem interações com serviços, talvez um método no componente ou um componente filho seja mais adequado.

### Quando Utilizar e Quando Evitar o Uso

**Quando Utilizar:**

- Para **formatação simples e declarativa** de dados: datas, moedas, números, porcentagens, textos (caixa alta/baixa, capitalização).
- Quando você precisa **lidar com pluralização e seleção condicional de strings** para internacionalização (`I18nPluralPipe`, `I18nSelectPipe`).
- Para **iterar sobre as propriedades de objetos ou Maps** no template (`KeyValuePipe`).
- Quando você precisa **filtrar ou ordenar** coleções de dados no template (para isso, você pode criar seus próprios pipes personalizados).
- Para **desempacotar Observables ou Promises** diretamente no template (`AsyncPipe`).
- Para manter o **código do componente limpo**, focando na lógica de negócios e deixando a apresentação para os pipes.

**Quando Evitar:**

- Para **lógica de negócios complexa** ou manipulações de estado que precisam ser controladas pelo componente. Pipes devem ser puros e não ter efeitos colaterais.
- Quando a **transformação é altamente específica** e usada em apenas um ou dois lugares, e a criação de um pipe separado seria um exagero. Um método simples no componente pode ser suficiente.
- Para **operações que modificam os dados originais**. Pipes são para transformação de exibição, não para mutação de dados.
- Em casos onde um pipe impuro (como `KeyValuePipe` em objetos que mudam muito) está causando **problemas de performance** e a lógica pode ser movida para o componente ou serviço de forma mais eficiente.

---

## Referências para Estudo Independente

Para aprofundar seus conhecimentos em Pipes no Angular, recomendo as seguintes fontes confiáveis:

- **Documentação Oficial do Angular - Pipes:** Esta é a fonte mais completa e atualizada.
    - [https://angular.io/guide/pipes](https://angular.io/guide/pipes)
    - [https://angular.io/api/common/DatePipe](https://angular.io/api/common/DatePipe) (e outros pipes específicos, incluindo os de i18n e KeyValuePipe)
- **Artigos e Tutoriais em Blogs Confiáveis:**
    - **Medium:** Busque por "Angular Pipes" no Medium para encontrar diversos tutoriais e exemplos. Sempre verifique a data de publicação para garantir que o conteúdo é recente.
    - [**Dev.to](http://dev.to/):** Outra excelente plataforma para artigos de desenvolvedores.
- **Cursos Online (Udemy, Alura, Coursera):** Muitos cursos de Angular dedicam seções inteiras aos pipes, incluindo a criação de pipes personalizados.
- **Livros sobre Angular:** Livros como "Angular Development with TypeScript" (por Yakov Fain e Anton Moiseev) ou "Pro Angular" (por Adam Freeman) geralmente contêm capítulos detalhados sobre pipes.

---

Peço desculpas novamente pela omissão, Gedê\! A.R.I.A está sempre aprendendo para te atender da melhor forma. Agora, sim, temos a sintaxe detalhada para cada um dos Common Pipes. Se tiver mais alguma dúvida, é só falar\!