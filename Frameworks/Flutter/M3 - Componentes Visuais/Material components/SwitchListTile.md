
## Introdução

O Flutter oferece uma ampla variedade de widgets para criar interfaces de usuário ricas e dinâmicas. Entre eles, o **SwitchListTile** é um widget altamente usado em configurações ou listas de preferências. Ele combina um **interruptor (Switch)** e uma **linha de lista (ListTile)**, proporcionando uma interface intuitiva e eficiente para alternar configurações em aplicativos.

## Sumário

1. [O que é e para que serve?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#o-que-%C3%A9-e-para-que-serve)
2. [Como funciona?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#como-funciona)
3. [Sintaxe de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#sintaxe-de-uso)
4. [Restrições de uso](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#restri%C3%A7%C3%B5es-de-uso)
5. [Quando utilizar?](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#quando-utilizar)
6. [Propriedades do SwitchListTile](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#propriedades-do-switchlisttile)
7. [Métodos do SwitchListTile](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#m%C3%A9todos-do-switchlisttile)
8. [Categoria do widget](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#categoria-do-widget)
9. [Exemplos práticos](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#exemplos-pr%C3%A1ticos)
10. [Considerações finais](https://chatgpt.com/c/674a1610-256c-8003-9d8d-bf91af6995bb#considera%C3%A7%C3%B5es-finais)

---

## O que é e para que serve?

O **SwitchListTile** é um widget que combina um interruptor (Switch) com um título e subtítulo, geralmente utilizado para apresentar opções ou preferências que podem ser ligadas/desligadas pelo usuário. É ideal para telas de configurações e menus.

### Principais usos:

- Permitir alternância de estado (ligado/desligado) em configurações de aplicativos.
- Fornecer uma interface amigável e organizada para listas com várias opções de alternância.

---

## Como funciona?

O **SwitchListTile** é essencialmente uma combinação de dois widgets principais:

1. **Switch**: Um botão deslizante que alterna entre dois estados (ativado/desativado).
2. **ListTile**: Um item de lista que suporta título, subtítulo, ícone inicial e widget final.

Quando o usuário interage com o interruptor, um callback (função `onChanged`) é acionado para processar a alteração de estado.

---

## Sintaxe de uso

A estrutura básica de um `SwitchListTile` é:

```dart
SwitchListTile({
  Key? key,
  required bool value,
  required ValueChanged<bool> onChanged,
  Widget? title,
  Widget? subtitle,
  Widget? secondary,
  bool? isThreeLine,
  bool? dense,
  EdgeInsetsGeometry? contentPadding,
  Color? activeColor,
  Color? tileColor,
  Color? activeTrackColor,
  Color? inactiveThumbColor,
  Color? inactiveTrackColor,
  VisualDensity? visualDensity,
  bool? autofocus,
  bool? enableFeedback,
  ShapeBorder? shape,
})
```

### Parâmetros detalhados

1. **`value`** _(obrigatório)_:
    
    - Indica o estado atual do interruptor (ligado ou desligado).
    - Aceita: `bool`.
    - Exemplo: `value: true`.
2. **`onChanged`** _(obrigatório)_:
    
    - Callback chamado quando o estado do interruptor muda.
    - Aceita: `ValueChanged<bool>` (função com um parâmetro booleano).
    - Exemplo: `onChanged: (bool novoValor) { setState(() { meuValor = novoValor; }); }`.
3. **`title`** _(opcional)_:
    
    - Widget que define o título principal.
    - Aceita: `Widget`.
    - Exemplo: `title: Text('Modo Escuro')`.
4. **`subtitle`** _(opcional)_:
    
    - Widget para o subtítulo abaixo do título.
    - Aceita: `Widget`.
    - Exemplo: `subtitle: Text('Ativar ou desativar o modo escuro.')`.
5. **`secondary`** _(opcional)_:
    
    - Widget exibido à esquerda do título, como um ícone.
    - Aceita: `Widget`.
    - Exemplo: `secondary: Icon(Icons.dark_mode)`.
6. **`isThreeLine`** _(opcional)_:
    
    - Indica se o item terá três linhas de texto.
    - Aceita: `bool`.
    - Exemplo: `isThreeLine: true`.
7. **`dense`** _(opcional)_:
    
    - Controla a densidade visual do item.
    - Aceita: `bool`.
    - Exemplo: `dense: true`.
8. **`contentPadding`** _(opcional)_:
    
    - Define o espaçamento interno do item.
    - Aceita: `EdgeInsetsGeometry`.
    - Exemplo: `contentPadding: EdgeInsets.all(8)`.
9. **`activeColor`** _(opcional)_:
    
    - Cor do polegar quando o interruptor está ativado.
    - Aceita: `Color`.
    - Exemplo: `activeColor: Colors.green`.
10. **`tileColor`** _(opcional)_:
    
    - Cor de fundo do item.
    - Aceita: `Color`.
    - Exemplo: `tileColor: Colors.grey[200]`.
11. **`activeTrackColor`** _(opcional)_:
    
    - Cor da trilha quando o interruptor está ativado.
    - Aceita: `Color`.
    - Exemplo: `activeTrackColor: Colors.greenAccent`.
12. **`inactiveThumbColor`** _(opcional)_:
    
    - Cor do polegar quando o interruptor está desativado.
    - Aceita: `Color`.
    - Exemplo: `inactiveThumbColor: Colors.grey`.
13. **`inactiveTrackColor`** _(opcional)_:
    
    - Cor da trilha quando o interruptor está desativado.
    - Aceita: `Color`.
    - Exemplo: `inactiveTrackColor: Colors.grey[300]`.
14. **`visualDensity`** _(opcional)_:
    
    - Controla o tamanho visual do widget.
    - Aceita: `VisualDensity`.
    - Exemplo: `visualDensity: VisualDensity.adaptivePlatformDensity`.
15. **`autofocus`** _(opcional)_:
    
    - Indica se o interruptor deve receber foco automaticamente.
    - Aceita: `bool`.
    - Exemplo: `autofocus: false`.
16. **`enableFeedback`** _(opcional)_:
    
    - Controla se o widget deve fornecer feedback tátil.
    - Aceita: `bool`.
    - Exemplo: `enableFeedback: true`.
17. **`shape`** _(opcional)_:
    
    - Define o formato do item.
    - Aceita: `ShapeBorder`.
    - Exemplo: `shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))`.

---

## Restrições de uso

1. **Compatibilidade de Layout**:
    
    - O `SwitchListTile` foi projetado para uso em listas e layouts baseados em itens. Não é recomendado para uso isolado ou fora de contexto.
2. **Espaçamento Interno**:
    
    - Pode gerar problemas visuais em layouts compactos devido ao espaçamento interno predefinido.
3. **Personalização Limitada**:
    
    - Apesar de permitir configurações básicas de estilo, não suporta personalização completa do componente.

---

## Quando utilizar?

- **Telas de Configuração**:
    - Ativar/desativar funcionalidades como notificações, modos temáticos, permissões, etc.
- **Listas de Preferências**:
    - Opções que precisam ser alternadas individualmente, mas listadas juntas para organização.
- **Formulários Simples**:
    - Em formulários que possuem entradas booleanas (sim/não, ativado/desativado).

---

## Propriedades do SwitchListTile

|**Propriedade**|**Descrição**|**Sintaxe de Uso**|
|---|---|---|
|`value`|Estado atual do interruptor.|`value: true`|
|`onChanged`|Callback chamado ao alterar o estado.|`onChanged: (novoValor) { ... }`|
|`title`|Título do item.|`title: Text('Título')`|
|`subtitle`|Subtítulo do item.|`subtitle: Text('Subtítulo')`|
|`secondary`|Widget exibido à esquerda do título.|`secondary: Icon(Icons.settings)`|
|`isThreeLine`|Indica se o item terá três linhas.|`isThreeLine: true`|
|`dense`|Controla a densidade visual do item.|`dense: true`|
|`contentPadding`|Define o espaçamento interno do item.|`contentPadding: EdgeInsets.all(8)`|
|`activeColor`|Cor do polegar quando o interruptor está ativado.|`activeColor: Colors.green`|
|`tileColor`|Cor de fundo do item.|`tileColor: Colors.grey[200]`|
|`activeTrackColor`|Cor da trilha quando o interruptor está ativado.|`activeTrackColor: Colors.greenAccent`|
|`inactiveThumbColor`|Cor do polegar quando o interruptor está desativado.|`inactiveThumbColor: Colors.grey`|
|`inactiveTrackColor`|Cor da trilha quando o interruptor está desativado.|`inactiveTrackColor: Colors.grey[300]`|
|`visualDensity`|Controla o tamanho visual do widget.|`visualDensity: VisualDensity.adaptive...`|
|`autofocus`|Indica se o interruptor deve receber foco automaticamente.|`autofocus: true`|
|`enableFeedback`|Controla se o widget deve fornecer feedback tátil.|`enableFeedback: true`|
|`shape`|Define o formato do item.|`shape: RoundedRectangleBorder(...)`|

---

## Métodos do SwitchListTile

O `SwitchListTile` é um widget de apresentação e não possui métodos diretamente associados. A funcionalidade principal é definida pelo callback `onChanged`.

---

## Categoria do Widget

O **SwitchListTile** se encaixa na seguinte categoria:

- **Material Components**: Por ser um componente do Material Design.

---

## Exemplos Práticos

### Exemplo Básico

```dart
bool isSwitched = false;

SwitchListTile(
  value: isSwitched,
  onChanged: (bool value) {
    setState(() {
      isSwitched = value;
    });
  },
  title: Text('Modo Escuro'),
  subtitle: Text('Ativar ou desativar o modo escuro.'),
  secondary: Icon(Icons.dark_mode),
);
```

### Exemplo com Estilização

```dart
SwitchListTile(
  value: true,
  onChanged: (bool value) {},
  title: Text('Notificações'),
  activeColor: Colors.blue,
  tileColor: Colors.grey[200],
  contentPadding: EdgeInsets.symmetric(horizontal: 16),
  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
);
```

---

## Considerações Finais

O **SwitchListTile** é uma ferramenta essencial para a criação de interfaces intuitivas e alinhadas ao Material Design. Sua combinação de funcionalidade e simplicidade o torna ideal para telas de configurações e listas interativas. Certifique-se de utilizá-lo em contextos apropriados para aproveitar ao máximo sua usabilidade e estética.

---

**Dica**: Sempre teste o comportamento do widget em diferentes dispositivos e oriente-se pelo guia do Material Design para garantir uma interface consistente e agradável.