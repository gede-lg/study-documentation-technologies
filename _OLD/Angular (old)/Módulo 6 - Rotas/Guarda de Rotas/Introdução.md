### O que é e para que serve?

A Guarda de Rotas no Angular é uma interface que permite controlar se um usuário pode navegar para ou sair de uma rota específica em sua aplicação. Ela serve para garantir que certas condições sejam atendidas antes de permitir o acesso a uma rota, como verificar se o usuário está autenticado, tem permissão para acessar uma página ou se os dados necessários para aquela página estão pré-carregados. Isso é crucial para criar uma experiência de usuário segura e eficiente.

### Principais Interfaces de Guarda de Rotas

O Angular fornece várias interfaces de guarda para cobrir diferentes aspectos do controle de rota:

#### CanActivate

Utilizada para decidir se uma rota pode ser ativada. É útil para casos de uso como autenticação de usuário, onde você quer impedir que usuários não autenticados acessem certas rotas.

**Exemplo:**

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = !!localStorage.getItem('user'); // Exemplo simplificado de autenticação
    if (!isAuthenticated) {
      this.router.navigate(['/login']); // Redireciona para o login se não estiver autenticado
      return false;
    }
    return true;
  }
}
```

#### CanActivateChild

Similar ao `CanActivate`, mas é aplicada a todas as rotas filhas de uma rota. Útil para proteger um grupo de rotas com uma única guarda.

**Exemplo:**

Imagine que você tenha uma seção de administração em sua aplicação, onde todas as rotas filhas devem ser protegidas. Você pode aplicar `CanActivateChild` na rota pai de administração para garantir isso.

#### CanDeactivate

Permite decidir se o usuário pode sair de uma rota. Isso é útil, por exemplo, para prevenir que o usuário saia de uma página com um formulário não salvo.

**Exemplo:**

```typescript
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
 canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
```

#### CanLoad

Determina se um módulo de recurso pode ser carregado preguiçosamente. Isso é importante para otimizar o carregamento de aplicativos grandes, garantindo que os módulos sejam carregados apenas quando necessário e se o usuário tem permissão para acessá-los.

**Exemplo:**

```typescript
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureModuleGuard implements CanLoad {
  constructor(private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = !!localStorage.getItem('user');
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
```

#### Resolve

Usado para pré-carregar dados necessários para uma rota antes de ativá-la. Isso melhora a experiência do usuário, evitando a renderização de uma rota com dados incompletos.

**Exemplo:**

```typescript
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
 

 providedIn: 'root'
})
export class DataResolverService implements Resolve<any> {
  constructor(private dataService: DataService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.dataService.getData();
  }
}
```

### Conclusão

As Guardas de Rotas no Angular são ferramentas fundamentais para controlar o acesso às rotas de uma aplicação, garantindo segurança e uma melhor experiência ao usuário. Implementá-las corretamente permite o desenvolvimento de aplicativos robustos e confiáveis. É importante entender cada tipo de guarda e saber quando utilizá-las para tirar o máximo proveito deste recurso.