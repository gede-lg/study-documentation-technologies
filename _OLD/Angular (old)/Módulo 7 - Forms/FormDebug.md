Um componente para rederizar informações do formulario sem necessidade de fazer submissão do mesmo

### Template HTML:

```html
<div style="margin-top: 20px" *ngIf="form" >

  <div>Detalhes do form</div>

  <pre>Form válido: {{ form.valid }}</pre>

  <!--pre>Form submetido: {{ form.submitted }}</pre -->

  <pre>Valores: <br>{{ form.value | json }}</pre>

</div>
```

### Componente TS:

```typescript
import { Component, OnInit, Input } from '@angular/core';

@Component({

  selector: 'app-form-debug',

  templateUrl: './form-debug.component.html',

  styleUrls: ['./form-debug.component.css']

})

export class FormDebugComponent implements OnInit {

  @Input() form;

  constructor() { }

  ngOnInit() { }
}
```
