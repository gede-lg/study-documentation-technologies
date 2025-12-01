### Interfaces de Guarda de Rotas no Angular

No Angular, as guardas de rotas são mecanismos de segurança que permitem controlar o acesso a certas rotas dentro de uma aplicação. Elas são definidas como serviços e podem ser aplicadas a rotas específicas na configuração de rotas do Angular para realizar checagens antes da navegação para uma rota ser permitida ou negada. Dentro desse contexto, `ActivatedRouteSnapshot` e `RouterStateSnapshot` são duas interfaces importantes.

#### `ActivatedRouteSnapshot`

**O que é e para que serve?**

`ActivatedRouteSnapshot` contém a informação sobre uma rota ativa em um dado momento. Esta interface fornece acesso ao estado da rota no ponto de ativação, incluindo os parâmetros da rota, os dados da rota, o caminho da URL, e mais. É útil para ler a informação da rota atual dentro de guardas de rota e resolvers.

**Sintaxe de uso**

Aqui está um exemplo básico de como `ActivatedRouteSnapshot` pode ser utilizado em uma guarda de rota:

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Acessar parâmetros da rota
    let id = next.paramMap.get('id');

    // Implementar lógica de verificação
    // ...

    return true; // ou false/UrlTree
  }
}
```

**Principais métodos e propriedades**

- `paramMap`: Um mapa de todos os parâmetros da rota.
- `data`: Um objeto contendo os dados associados à rota, definidos na configuração da rota.
- `url`: Uma array dos segmentos de URL da rota ativa.

#### `RouterStateSnapshot`

**O que é e para que serve?**

`RouterStateSnapshot` representa o estado do roteador em um dado momento. Ao contrário de `ActivatedRouteSnapshot`, que contém informações sobre uma rota ativa específica, `RouterStateSnapshot` fornece uma visão geral do estado de todas as rotas ativas. É útil para examinar o estado completo da navegação como parte de guardas de rota.

**Sintaxe de uso**

`RouterStateSnapshot` é tipicamente usado em conjunto com `ActivatedRouteSnapshot` em guardas de rota, como mostrado no exemplo anterior. Aqui está como você pode usá-lo:

```typescript
canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): boolean {
  console.log(state.url); // Acessa a URL completa para onde a navegação está ocorrendo

  // Implementar lógica baseada no estado da rota
  // ...

  return true; // ou false/UrlTree
}
```

**Principais métodos e propriedades**

- `url`: A URL completa para a qual a navegação está ocorrendo.
- `root`: Uma referência ao primeiro `ActivatedRouteSnapshot` da árvore de rotas.

#### Informações Adicionais

- **Guardas de Rota Disponíveis**: Angular fornece diferentes tipos de guardas de rota, como `CanActivate`, `CanActivateChild`, `CanDeactivate`, e `CanLoad`. Cada uma serve a um propósito específico, desde a verificação de permissões antes de entrar em uma rota até a prevenção de saídas não autorizadas de uma rota.
- **Uso com `Router` e `NavigationExtras`**: Além de usar `ActivatedRouteSnapshot` e `RouterStateSnapshot`, você pode interagir diretamente com o serviço `Router` do Angular para programar redirecionamentos, passar extras de navegação, etc., o que fornece controle fino sobre o comportamento de navegação na sua aplicação.

Essas interfaces e conceitos são fundamentais para a implementação de lógicas de acesso e controle de navegação em aplicações Angular, permitindo criar experiências de usuário mais seguras e responsivas.