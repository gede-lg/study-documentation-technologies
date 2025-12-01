### O que é e para que serve?

O `CanDeactivate` é uma interface de guarda de rotas no Angular que pode ser implementada para controlar se um usuário pode ou não navegar para fora de uma rota atual. Essa funcionalidade é útil para casos em que você quer impedir que os usuários saiam de uma página sem salvar as alterações, por exemplo, em um formulário de edição. Ao tentar sair da página, o usuário pode receber um aviso, dando-lhe a opção de permanecer na página atual e salvar as alterações ou descartá-las.

### Sintaxe de uso

Para utilizar o `CanDeactivate`, você precisa seguir alguns passos:

1. **Criação da Guarda:**
Primeiro, você cria uma classe que implementa a interface `CanDeactivate`. Esta classe deve implementar o método `canDeactivate`, que é chamado quando se tenta navegar para fora da rota.

```typescript
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

// Componente que você deseja controlar a saída
import { YourComponent } from './your.component';

@Injectable({
  providedIn: 'root'
})
export class YourCanDeactivateGuard implements CanDeactivate<YourComponent> {
  canDeactivate(component: YourComponent): boolean {
    // Aqui, você pode verificar se há alterações não salvas, por exemplo
    return component.podeDesativar ? component.verificarAlteracoes() : true;
  }
}
```

Neste exemplo, `YourComponent` é o componente que você quer proteger. A função `verificarAlteracoes` seria uma função dentro de `YourComponent` que verifica se há mudanças não salvas e retorna `true` ou `false` dependendo se o usuário pode sair da página ou não.

2. **Registrando a Guarda nas Rotas:**
Depois de criar a guarda, você precisa registrá-la na configuração das rotas do seu módulo Angular onde ela será usada. Isso é feito no arquivo de rotas (geralmente um arquivo com um nome terminando em `-routing.module.ts`).

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YourComponent } from './your.component';
import { YourCanDeactivateGuard } from './your-can-deactivate.guard';

const routes: Routes = [
  {
    path: 'your-path',
    component: YourComponent,
    canDeactivate: [YourCanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YourRoutingModule { }
```

3. **Implementando a Verificação no Componente:**
Finalmente, no componente que você deseja proteger (`YourComponent`, no nosso exemplo), você implementa a lógica para decidir se o usuário pode deixar a página ou não. Isso normalmente envolve verificar se o formulário foi modificado ou se há alguma operação pendente que precisa ser concluída antes de sair.

```typescript
export class YourComponent {
  podeDesativar = true; // Controla se a verificação deve ser feita

  verificarAlteracoes(): boolean {
    // Implemente sua lógica aqui para verificar se há alterações não salvas
    // Retorna true se for seguro sair, false para bloquear a saída
  }
}
```

### Como aplicar/utilizar

Para aplicar a guarda `CanDeactivate`, siga os passos mencionados anteriormente: crie a guarda, registre-a nas rotas desejadas e implemente a lógica de verificação no componente protegido. Isso garantirá que, antes de sair da rota protegida, a guarda será consultada para confirmar se a navegação pode prosseguir, baseando-se na lógica que você definiu (por exemplo, se há alterações não salvas).

### Observações importantes:

- **Flexibilidade:** A guarda `CanDeactivate` oferece uma flexibilidade considerável, permitindo que você implemente praticamente qualquer lógica para decidir se permite ou não a navegação para fora da rota.
- **Uso de Promises ou Observables:** Além de retornar um valor booleano simples, o método `canDeactivate` também pode retornar um `Observable<boolean>` ou `Promise<boolean>`, permitindo assim a realização de verificações assíncronas antes de decidir se permite a navegação.
- **Diálogos de Confirmação:** Uma prática comum é utilizar um diálogo de confirmação quando o usuário tenta sair de uma página com alterações não salvas, proporcionando uma interação mais amigável.

Este recurso é extremamente útil para melhorar a experiência do usuário, garantindo que alterações importantes não sejam perdidas por saídas acidentais ou intencionais da página.