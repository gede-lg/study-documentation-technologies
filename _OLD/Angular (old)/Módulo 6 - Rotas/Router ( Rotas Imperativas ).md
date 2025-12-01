
No desenvolvimento de aplicações Angular, as rotas desempenham um papel crucial na navegação entre diferentes componentes ou páginas. Além da definição declarativa de rotas usando o template (HTML), o Angular oferece um método programático para lidar com a navegação, conhecido como rotas imperativas. Essas são fundamentais para interações dinâmicas, onde a navegação depende de lógica condicional, eventos ou ações do usuário. Abaixo, exploramos detalhadamente o conceito, a sintaxe, e como trabalhar com rotas imperativas no Angular.

## O que é e para que serve?

Rotas imperativas referem-se à navegação entre rotas no Angular de forma programática, ou seja, através do código TypeScript, em vez de links no template. Este método é essencial quando a decisão de navegação não pode ser determinada de antemão, permitindo que a aplicação responda a eventos, condições ou inputs do usuário de forma mais flexível.

## Sintaxe de uso e principais métodos ou propriedades

Para usar rotas imperativas no Angular, você precisa injetar a classe `Router` disponível no pacote `@angular/router` no seu componente ou serviço. A classe `Router` fornece vários métodos para controlar a navegação, dos quais os mais utilizados são:

- `navigate(commands, extras?)`: Navega para uma rota especificada. O argumento `commands` é um array que representa o caminho para a rota, enquanto `extras` são opções adicionais como parâmetros de query e estado de navegação.
- `navigateByUrl(url, extras?)`: Navega para uma URL específica. É útil quando você tem a URL como uma string.

### Exemplo de uso:

```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-me-component',
  templateUrl: './meu-componente.component.html',
  styleUrls: ['./meu-componente.component.css']
})
export class MeuComponenteComponent {

  constructor(private router: Router) { }

  navegarParaUsuario(id: number) {
    // Usando navigate
    this.router.navigate(['/usuario', id]);

    // Ou usando navigateByUrl
    this.router.navigateByUrl(`/usuario/${id}`);
  }
}
```

## Redirecionamento via código

O redirecionamento programático é uma prática comum em aplicações SPA, especialmente em casos como após o login, você quer redirecionar o usuário para uma página de dashboard, ou em situações de guarda de rotas onde um usuário não autorizado é redirecionado para a página de login.

### Exemplo de redirecionamento após login:

```typescript
login(email: string, password: string) {
  this.authService.login(email, password).subscribe(() => {
    // Navegação imperativa para o dashboard após o sucesso do login
    this.router.navigate(['/dashboard']);
  });
}
```

## Definindo e extraindo parâmetros de url (query)

Além da navegação, a classe `Router` permite a definição de parâmetros de URL (conhecidos como query parameters) de forma programática, e a classe `ActivatedRoute` é usada para extrair esses parâmetros.

### Definindo parâmetros de query:

```typescript
buscarProdutos(params: any) {
  // Navega para a mesma rota com novos parâmetros de query
  this.router.navigate(['/produtos'], { queryParams: params });
}
```

### Extraindo parâmetros de query:

Para extrair parâmetros de query, você pode usar o objeto `ActivatedRoute`:

```typescript
import { ActivatedRoute } from '@angular/router';

constructor(private activatedRoute: ActivatedRoute) {
  this.activatedRoute.queryParams.subscribe(params => {
    console.log(params); // Exibe os parâmetros de query atuais
  });
}
```

## Conclusão

As rotas imperativas no Angular oferecem uma maneira flexível e poderosa de controlar a navegação em aplicações SPA, permitindo a implementação de lógicas de navegação complexas e dinâmicas. Ao entender como utilizar o serviço `Router` para navegação programática e manipulação de parâmetros de URL, desenvolvedores podem criar experiências de usuário ricas e interativas.