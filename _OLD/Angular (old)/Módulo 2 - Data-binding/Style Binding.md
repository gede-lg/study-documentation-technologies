### O que é Style Binding?

Style Binding é utilizado para aplicar estilos inline diretamente nos elementos HTML a partir dos dados do componente TypeScript. Isso permite que os estilos sejam definidos ou alterados dinamicamente, baseados na lógica do aplicativo ou nos dados do usuário.

### Para que serve?

Serve para:
- Alterar estilos de elementos HTML dinamicamente com base em condições ou eventos.
- Aplicar estilos que não podem ser facilmente aplicados ou alterados usando folhas de estilo CSS estáticas.
- Personalizar a apresentação de componentes com base nas preferências do usuário ou em dados variáveis.

### Sintaxe

#### Usando `ngStyle`

A diretiva `ngStyle` permite que você aplique múltiplos estilos a um elemento com base em um objeto expresso no componente.

**Exemplo:**

```html
<div [ngStyle]="{'font-size': tamanhoFonte, 'color': corFonte}">
  Texto com estilo dinâmico.
</div>
```

No componente TypeScript:

```typescript
@Component({...})
export class SeuComponente {
  tamanhoFonte = '16px';
  corFonte = 'blue';
}
```

Neste exemplo, `tamanhoFonte` e `corFonte` são propriedades do componente que determinam o tamanho da fonte e a cor do texto, respectivamente.

#### Style Binding com uma única propriedade

Para uma única propriedade de estilo, você pode usar a sintaxe de colchetes com o prefixo `style` seguido pelo nome da propriedade de estilo em camelCase.

**Exemplo:**

```html
<div [style.color]="corFonte">Texto com cor dinâmica.</div>
```

No componente TypeScript:

```typescript
@Component({...})
export class SeuComponente {
  corFonte = 'red';
}
```

### Outras Formas de Style Binding

Além das mencionadas, o Angular também permite condições dentro do binding:

**Exemplo com condição:**

```html
<div [style.font-weight]="condicao ? 'bold' : 'normal'">Texto condicional.</div>
```

No componente TypeScript:

```typescript
@Component({...})
export class SeuComponente {
  condicao = true; // ou false, dependendo da lógica desejada
}
```

Este exemplo aplicará o estilo de fonte em negrito se a condição for verdadeira, e fonte normal se for falsa.