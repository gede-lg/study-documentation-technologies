## O que é Angular?

Angular é uma plataforma e framework para construir aplicações web de página única (Single Page Applications - SPAs) desenvolvida pelo Google. Escrito em TypeScript, ele fornece ferramentas para construir aplicações de forma eficiente, seguindo padrões modernos de web, como web components, e oferece uma estrutura robusta para organizar o código em módulos, serviços, componentes, diretivas, entre outros.

## Para que serve?

Angular é utilizado para desenvolver aplicações web ricas e interativas, permitindo aos desenvolvedores criar interfaces de usuário dinâmicas e responsivas. Com Angular, é possível:

- Construir SPAs que carregam rapidamente e podem oferecer uma experiência de usuário semelhante a aplicações nativas.
- Organizar o código em módulos reutilizáveis, facilitando a manutenção e o teste da aplicação.
- Aproveitar a injeção de dependência para fornecer serviços reutilizáveis por diferentes partes da aplicação.
- Utilizar um sistema de templates declarativos, que ajuda a definir interfaces de usuário complexas de forma mais simples e legível.
- Implementar formularios reativos e baseados em templates para coletar e validar dados de usuário.

## Estrutura de Pastas

Uma aplicação Angular típica tem uma estrutura de pastas que organiza o código de forma lógica, facilitando o desenvolvimento e a manutenção. Aqui está um exemplo de como essa estrutura pode parecer:

```
my-app/
|-- src/
|   |-- app/
|   |   |-- components/        # Componentes específicos da aplicação
|   |   |-- services/          # Serviços reutilizáveis
|   |   |-- models/            # Modelos de dados
|   |   |-- app.module.ts      # Módulo raiz da aplicação
|   |   |-- app.component.*    # Componente raiz da aplicação
|   |-- assets/                # Arquivos estáticos (imagens, fontes, etc.)
|   |-- environments/          # Configurações de ambiente
|   |-- index.html             # Página HTML principal
|   |-- main.ts                # Ponto de entrada da aplicação
|   |-- polyfills.ts           # Polyfills necessários
|   |-- styles.css             # Estilos globais
|-- e2e/                       # Testes de ponta a ponta
|-- angular.json               # Configuração do projeto Angular
|-- package.json               # Metadados do projeto e dependências
|-- tsconfig.json              # Configurações do compilador TypeScript
```

### Componentes

Os componentes são os blocos de construção básicos das aplicações Angular, definindo partes da interface do usuário que podem ser reutilizadas. Um componente consiste em uma classe que encapsula dados e lógica, um template HTML que define a vista, e um seletor CSS que permite a sua inclusão em outras vistas.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.css']
})
export class HelloWorldComponent {
  title = 'Hello, Angular!';
}
```

### Serviços

Serviços são classes com um propósito bem definido, geralmente compartilhando dados ou lógicas específicas, como a comunicação com um backend. São marcados com o decorador `@Injectable`, indicando que podem ser injetados em componentes ou outros serviços.

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  getData() {
    return ['Data 1', 'Data 2', 'Data 3'];
  }
}
```

### Módulos

Módulos Angular permitem organizar componentes, serviços e outras peças em blocos coesos de funcionalidades. Cada aplicação Angular tem pelo menos um módulo raiz, geralmente chamado `AppModule`, que serve para inicializar a aplicação.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HelloWorldComponent } from './components/hello-world/hello-world.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloWorldComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Considerações Finais

Angular é uma plataforma poderosa para o desenvolvimento de aplicações web modernas. Com seu conjunto rico de recursos, permite aos desenvolvedores construir aplicações complexas e escaláveis com eficiência. A estrutura de pastas e a organização do código são fundamentais para aproveitar ao máximo o que o Angular oferece, facilitando a manutenção e a expansão das aplicações.