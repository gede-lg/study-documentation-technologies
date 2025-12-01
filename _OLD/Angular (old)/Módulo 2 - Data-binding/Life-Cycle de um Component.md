
O ciclo de vida de um componente em Angular descreve as diferentes fases pelas quais um componente passa desde a sua criação até a sua destruição. Angular fornece ganchos de ciclo de vida (lifecycle hooks) que permitem executar código em momentos específicos.

### Principais Ganchos do Ciclo de Vida:

- **ngOnInit**: Chamado após a criação do componente e da inicialização dos inputs do componente.
- **ngOnChanges**: Executado sempre que há mudanças nas propriedades de entrada do componente (@Input properties).
- **ngAfterViewInit**: Chamado após a inicialização das views do componente e dos componentes filhos.
- **ngOnDestroy**: Executado imediatamente antes de Angular destruir o componente.

### Exemplo de Uso:

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exemplo',
  templateUrl: './exemplo.component.html',
  styleUrls: ['./exemplo.component.css']
})
export class ExemploComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    console.log('Componente inicializado');
  }
}
```