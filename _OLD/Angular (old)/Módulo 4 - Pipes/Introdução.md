# Pipes no Angular

Pipes no Angular são ferramentas poderosas usadas para transformar dados no template de forma simples e declarativa. Eles oferecem uma maneira de formatar strings, valores monetários, datas e outras transformações de dados diretamente nos templates, evitando a necessidade de escrever código boilerplate no componente para estas transformações.

## O que é e para que serve?

Um pipe pega dados de entrada e os transforma em um formato desejado para exibição no template. Por exemplo, você pode querer exibir datas em um formato específico, números como moeda, ou aplicar filtragem e ordenação a uma lista de itens sem alterar os dados originais.

## Diferença entre Pipe Impuro vs Pipe Puro

- **Pipe Puro**: Só executa a transformação quando detecta uma mudança pura nos inputs do pipe (por exemplo, uma mudança de valor primitivo ou uma mudança de objeto/dados de array por referência). Pipes puros são performáticos porque o Angular executa a transformação apenas quando é estritamente necessário.

- **Pipe Impuro**: Executa a transformação em cada ciclo de detecção de mudanças, independentemente de haver ou não mudanças nos inputs. Isso pode ser útil para transformações que dependem de variáveis externas além dos inputs do pipe, mas pode levar a problemas de performance se usado sem cautela.

## Parâmetros nos Pipes e Pipes Aninhados

Pipes podem aceitar parâmetros para customizar a saída. Por exemplo, o pipe `date` pode receber um formato de data como parâmetro. Pipes também podem ser aninhados, permitindo a aplicação de múltiplas transformações em sequência.

### Exemplo com Parâmetros:

```typescript
{{ birthday | date:'longDate' }}
```

Neste exemplo, o pipe `date` está formatando a data de `birthday` usando o formato `longDate`.

### Exemplo de Pipes Aninhados:

```typescript
{{ (text | lowercase) | slice:0:5 }}
```

Aqui, `text` é primeiro convertido para minúsculas pelo pipe `lowercase` e então o resultado é cortado para os primeiros 5 caracteres pelo pipe `slice`.

## Quais são e como usar cada um deles

Angular vem com uma série de pipes embutidos, incluindo:

- **DatePipe**: Transforma datas em formatos legíveis.
- **UpperCasePipe** e **LowerCasePipe**: Transformam texto em maiúsculas ou minúsculas.
- **CurrencyPipe**: Formata números como valores monetários.
- **DecimalPipe**: Formata números como texto decimal.
- **PercentPipe**: Transforma um número em um percentual.
- **SlicePipe**: Extrai uma seção de uma lista ou string.
- **JsonPipe**: Converte um valor em uma string JSON formatada.

### Exemplos de Uso:

**DatePipe**:

```typescript
{{ today | date:'dd/MM/yyyy' }}
```

Transforma a variável `today` em uma string de data no formato `dd/MM/yyyy`.

**CurrencyPipe**:

```typescript
{{ amount | currency:'USD':true:'4.2-2' }}
```

Formata `amount` como um valor monetário em dólares americanos, incluindo o símbolo de moeda, com pelo menos 4 dígitos antes do ponto decimal e de 2 a 2 dígitos após o ponto decimal.

**JsonPipe**:

```typescript
{{ object | json }}
```

Converte `object` em uma string JSON formatada, útil para debugging.

## Considerações Adicionais

- **Custom Pipes**: Além dos pipes embutidos, o Angular permite a criação de pipes customizados. Isso é útil para transformações específicas de dados que não são cobertas pelos pipes padrão.

- **Segurança**: Quando estiver trabalhando com conteúdo gerado dinamicamente, especialmente com links ou HTML inseridos diretamente nos templates, é importante considerar o uso de pipes como `safeHtml`, `safeStyle`, `safeUrl`, e `safeResourceUrl` do pacote `@angular/platform-browser` para prevenir vulnerabilidades de segurança como Cross-Site Scripting (XSS).

Pipes são uma característica essencial do Angular, proporcionando uma maneira declarativa e eficiente de manipular a apresentação de dados nos templates. Combinando pipes embutidos, pipes aninhados, e a capacidade de criar pipes customizados, os desenvolvedores têm uma ferramenta poderosa para criar interfaces de usuário dinâmicas e interativas.