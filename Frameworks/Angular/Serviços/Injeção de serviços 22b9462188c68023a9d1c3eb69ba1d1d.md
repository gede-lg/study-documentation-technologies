# Injeção de serviços

## Injetando Serviços em Componentes e Outros Serviços no Angular

No desenvolvimento de aplicações modernas com Angular, a **injeção de dependência** é um conceito central e fundamental. Ela permite que classes recebam suas dependências de uma fonte externa, em vez de criá-las por conta própria. Isso promove um código mais modular, testável e de fácil manutenção. No contexto do Angular, os **serviços** são classes projetadas para serem injetáveis e para fornecer funcionalidades específicas, como acesso a dados, lógica de negócios ou utilitários, para componentes e outros serviços da aplicação.

### O que são Serviços e para que servem?

No Angular, um **serviço** é uma classe regular TypeScript que é decorada com `@Injectable()`. Essa anotação marca a classe como um provedor de serviço, indicando que ela pode ser injetada em outras partes da aplicação.

**Para que servem os serviços?**

- **Reutilização de Código:** Permitem encapsular lógicas e funcionalidades que podem ser compartilhadas por múltiplos componentes, evitando duplicação de código.
- **Separação de Preocupações:** Ajudam a manter a responsabilidade dos componentes focada na apresentação dos dados, enquanto a lógica de negócios e o acesso a dados são delegados aos serviços.
- **Testabilidade:** Tornam os componentes mais fáceis de testar em isolamento, pois as dependências podem ser facilmente substituídas por mocks ou stubs durante os testes.
- **Manutenção:** Simplificam a manutenção do código, pois as alterações em uma lógica específica podem ser feitas em um único local (o serviço), impactando todos os componentes que o utilizam.

---

## Sumário

- **Injeção de Dependência no Angular**
    - Provedores
    - Injetores
- **Criando um Serviço**
    - `@Injectable()`
    - Propriedade `providedIn`
- **Injetando um Serviço em um Componente**
- **Injetando um Serviço em Outro Serviço**
- **Restrições de Uso e Melhores Práticas**
- **Exemplos de Código Otimizados**
    - Exemplo Básico: Serviço de Log
    - Exemplo Avançado: Serviço de Dados com API
- **Informações Adicionais**
    - Vantagens e Desvantagens da Injeção de Dependência
    - Quando utilizar e quando evitar o uso de serviços
- **Referências para Estudo Independente**

---

## Conteúdo Detalhado

### Injeção de Dependência no Angular

A injeção de dependência é um padrão de design que o Angular utiliza para fornecer instâncias de serviços para as classes que precisam delas.

### Provedores

Um **provedor** é uma receita que informa ao injetor como obter uma instância de uma dependência. No Angular, isso geralmente é feito adicionando o serviço ao array `providers` de um módulo (ou usando `providedIn: 'root'`).

### Injetores

Um **injetor** é um mecanismo que cria e gerencia instâncias de dependências. Existem injetores em diferentes níveis na hierarquia de uma aplicação Angular (módulos, componentes). Quando um componente ou serviço precisa de uma dependência, o injetor encontra o provedor apropriado e entrega uma instância da dependência.

### Criando um Serviço

Para criar um serviço, usamos o CLI do Angular ou o fazemos manualmente.

```bash
ng generate service my-data

```

Isso gerará:

```tsx
// src/app/my-data.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyDataService {

  constructor() { }
}

```

### `@Injectable()`

O decorador `@Injectable()` marca uma classe como um provedor de serviço. É fundamental para que o injetor do Angular possa reconhecer e fornecer uma instância dessa classe.

### Propriedade `providedIn`

A propriedade `providedIn` no objeto de configuração de `@Injectable()` especifica onde o serviço deve ser fornecido:

- `'root'`: O serviço é fornecido no injetor raiz da aplicação. Isso significa que há uma única instância do serviço disponível para toda a aplicação, e ela é carregada de forma *lazy* (apenas quando é injetada pela primeira vez). Esta é a abordagem recomendada para a maioria dos serviços.
- `'platform'`: O serviço é fornecido no injetor da plataforma, que é um nível acima do injetor raiz da aplicação. Raramente usado para a maioria das aplicações.
- `'any'`: Uma nova instância do serviço é fornecida para cada módulo *lazy-loaded* que injetar o serviço. Se um módulo *eager-loaded* injetar, será a mesma instância do root.
- **Um módulo específico (ex: `AppModule`)**: O serviço é fornecido apenas dentro do escopo daquele módulo. Útil para serviços que são específicos de um determinado recurso ou módulo e não precisam ser globais. Ex:
    
    ```tsx
    // src/app/app.module.ts
    import { NgModule } from '@angular/core';
    import { MyDataService } from './my-data.service';
    
    @NgModule({
      providers: [MyDataService], // Provedor específico do módulo
      // ...
    })
    export class AppModule { }
    
    ```
    

### Injetando um Serviço em um Componente

Para injetar um serviço em um componente, você o declara como um parâmetro no construtor do componente.

```tsx
// src/app/my-component/my-component.component.ts
import { Component, OnInit } from '@angular/core';
import { MyDataService } from '../my-data.service'; // Importa o serviço

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})
export class MyComponent implements OnInit {

  data: string = '';

  // Injeção do MyDataService no construtor
  constructor(private myDataService: MyDataService) { }

  ngOnInit(): void {
    this.data = this.myDataService.getSomeData();
  }

  // Exemplo de uso do serviço para alterar dados
  updateData(): void {
    this.myDataService.setSomeData('New data from component!');
    this.data = this.myDataService.getSomeData();
  }
}

```

Neste exemplo, o Angular detecta que `MyDataService` é uma dependência e, usando o injetor, fornece uma instância do `MyDataService` para o `MyComponent`. A palavra-chave `private` (ou `public`) antes do parâmetro do construtor é um atalho do TypeScript que automaticamente cria uma propriedade da classe com o mesmo nome e atribui a ela a instância injetada.

### Injetando um Serviço em Outro Serviço

Você pode injetar um serviço em outro serviço da mesma forma que injeta em um componente, também usando o construtor. Isso é comum para serviços que dependem de outras funcionalidades.

```tsx
// src/app/logger.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: string) {
    console.log(`[Logger]: ${message}`);
  }
}

// src/app/another-data.service.ts
import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service'; // Importa o serviço LoggerService

@Injectable({
  providedIn: 'root'
})
export class AnotherDataService {
  constructor(private logger: LoggerService) { } // Injeta LoggerService

  fetchData(): string {
    this.logger.log('Fetching data from AnotherDataService...');
    return 'Data fetched by AnotherDataService';
  }
}

```

### Restrições de Uso

- **Cuidado com Dependências Circulares:** Evite situações onde o Serviço A depende do Serviço B e o Serviço B depende do Serviço A. Isso pode levar a erros em tempo de execução e dificultar a inicialização.
- **Serviços Sem `@Injectable()`:** Um serviço que não possui o decorador `@Injectable()` (a menos que seja um serviço muito simples sem dependências e seja explicitamente provido) não será "detectável" pelo injetor do Angular e não poderá ser injetado.
- **Escopo dos Provedores:** Entender o escopo de `providedIn` é crucial. Se você prover um serviço em um componente em vez de `root`, cada instância desse componente terá sua própria instância do serviço. Isso pode ser desejável em alguns casos, mas geralmente um serviço global é o mais comum.

---

## Exemplos de Código Otimizados

### Exemplo Básico: Serviço de Log

Um serviço de log é um caso de uso clássico para demonstrar a injeção de dependência.

```tsx
// src/app/logging/log.service.ts
// Este serviço será responsável por registrar mensagens no console.
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Disponível em toda a aplicação
})
export class LogService {

  constructor() {
    console.log('LogService instanciado.');
  }

  /**
   * Registra uma mensagem de informação.
   * @param message A mensagem a ser registrada.
   */
  info(message: string): void {
    console.info(`[INFO] ${new Date().toLocaleTimeString()}: ${message}`);
  }

  /**
   * Registra uma mensagem de aviso.
   * @param message A mensagem a ser registrada.
   */
  warn(message: string): void {
    console.warn(`[WARN] ${new Date().toLocaleTimeString()}: ${message}`);
  }

  /**
   * Registra uma mensagem de erro.
   * @param message A mensagem a ser registrada.
   * @param error O objeto de erro opcional.
   */
  error(message: string, error?: any): void {
    console.error(`[ERROR] ${new Date().toLocaleTimeString()}: ${message}`, error);
  }
}

```

```tsx
// src/app/dashboard/dashboard.component.ts
// Um componente que utiliza o LogService para registrar eventos.
import { Component, OnInit } from '@angular/core';
import { LogService } from '../logging/log.service'; // Importa o serviço de log

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private logService: LogService) { // Injeta o LogService
    this.logService.info('DashboardComponent: Construtor chamado.');
  }

  ngOnInit(): void {
    this.logService.info('DashboardComponent: ngOnInit chamado. Carregando dados...');
    // Simula o carregamento de dados
    setTimeout(() => {
      this.logService.info('DashboardComponent: Dados carregados com sucesso!');
    }, 1500);
  }

  performAction(): void {
    this.logService.warn('DashboardComponent: Ação do usuário iniciada.');
    try {
      // Simula uma ação que pode falhar
      if (Math.random() > 0.7) {
        throw new Error('Falha simulada na ação!');
      }
      this.logService.info('DashboardComponent: Ação concluída com sucesso.');
    } catch (e: any) {
      this.logService.error('DashboardComponent: Erro ao performar ação.', e);
    }
  }
}

```

### Exemplo Avançado: Serviço de Dados com API

Este exemplo demonstra um serviço que interage com uma API, encapsulando a lógica de requisições HTTP.

```tsx
// src/app/user/user.service.ts
// Serviço para interagir com a API de usuários.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Para requisições HTTP
import { Observable, throwError } from 'rxjs'; // Para programação reativa
import { catchError, retry } from 'rxjs/operators'; // Operadores RxJS
import { LogService } from '../logging/log.service'; // Reutiliza o LogService

// Interface para tipagem dos dados do usuário
export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = '<https://jsonplaceholder.typicode.com/users>'; // Exemplo de API pública

  constructor(
    private http: HttpClient, // Injeta o HttpClient
    private logService: LogService // Injeta o LogService
  ) {
    this.logService.info('UserService instanciado.');
  }

  /**
   * Obtém todos os usuários da API.
   * @returns Um Observable de um array de usuários.
   */
  getUsers(): Observable<User[]> {
    this.logService.info('UserService: Solicitando lista de usuários da API.');
    return this.http.get<User[]>(this.apiUrl)
      .pipe(
        retry(2), // Tenta a requisição 2 vezes em caso de falha
        catchError(error => {
          this.logService.error('UserService: Erro ao buscar usuários.', error);
          return throwError(() => new Error('Algo deu errado ao buscar usuários; tente novamente mais tarde.'));
        })
      );
  }

  /**
   * Obtém um usuário específico pelo ID.
   * @param id O ID do usuário.
   * @returns Um Observable de um usuário.
   */
  getUserById(id: number): Observable<User> {
    this.logService.info(`UserService: Solicitando usuário com ID ${id}.`);
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<User>(url)
      .pipe(
        catchError(error => {
          this.logService.error(`UserService: Erro ao buscar usuário com ID ${id}.`, error);
          return throwError(() => new Error(`Não foi possível encontrar o usuário com ID ${id}.`));
        })
      );
  }

  /**
   * Adiciona um novo usuário.
   * @param user O objeto usuário a ser adicionado (sem ID, pois a API o gerará).
   * @returns Um Observable do usuário adicionado.
   */
  addUser(user: Omit<User, 'id'>): Observable<User> {
    this.logService.info('UserService: Adicionando novo usuário.');
    return this.http.post<User>(this.apiUrl, user)
      .pipe(
        catchError(error => {
          this.logService.error('UserService: Erro ao adicionar usuário.', error);
          return throwError(() => new Error('Falha ao adicionar usuário.'));
        })
      );
  }

  /**
   * Atualiza um usuário existente.
   * @param user O objeto usuário com as informações atualizadas.
   * @returns Um Observable do usuário atualizado.
   */
  updateUser(user: User): Observable<User> {
    this.logService.info(`UserService: Atualizando usuário com ID ${user.id}.`);
    const url = `${this.apiUrl}/${user.id}`;
    return this.http.put<User>(url, user)
      .pipe(
        catchError(error => {
          this.logService.error(`UserService: Erro ao atualizar usuário com ID ${user.id}.`, error);
          return throwError(() => new Error('Falha ao atualizar usuário.'));
        })
      );
  }

  /**
   * Exclui um usuário pelo ID.
   * @param id O ID do usuário a ser excluído.
   * @returns Um Observable vazio após a exclusão.
   */
  deleteUser(id: number): Observable<void> {
    this.logService.info(`UserService: Excluindo usuário com ID ${id}.`);
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(error => {
          this.logService.error(`UserService: Erro ao excluir usuário com ID ${id}.`, error);
          return throwError(() => new Error('Falha ao excluir usuário.'));
        })
      );
  }
}

```

```tsx
// src/app/user/user-list/user-list.component.ts
// Um componente que consome o UserService para exibir e gerenciar usuários.
import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../user.service'; // Importa o UserService e a interface User
import { LogService } from '../../logging/log.service'; // Reutiliza o LogService
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users$: Observable<User[]>; // Observable para a lista de usuários
  loading = false;
  errorMessage: string = '';

  constructor(
    private userService: UserService, // Injeta o UserService
    private logService: LogService // Injeta o LogService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.logService.info('UserListComponent: Carregando usuários...');
    this.users$ = this.userService.getUsers().pipe(
      catchError(error => {
        this.errorMessage = error.message;
        this.loading = false;
        return of([]); // Retorna um Observable vazio em caso de erro
      })
    );
    this.users$.subscribe(() => this.loading = false);
  }

  // Métodos para adicionar, atualizar e excluir usuários podem ser implementados aqui,
  // chamando os métodos correspondentes do userService.
  deleteUser(id: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.logService.info(`UserListComponent: Usuário com ID ${id} excluído com sucesso.`);
          this.loadUsers(); // Recarrega a lista
        },
        error: (e) => {
          this.logService.error(`UserListComponent: Erro ao excluir usuário com ID ${id}.`, e);
          this.errorMessage = e.message;
        }
      });
    }
  }
}

```

**Observação:** Para o exemplo avançado, você precisará importar o `HttpClientModule` no seu `AppModule`:

```tsx
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // <-- Importe aqui

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user/user-list/user-list.component';
// ... outros imports

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserListComponent,
    // ... outros componentes
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // <-- Adicione aqui
    // ... outros módulos
  ],
  providers: [], // Serviços com `providedIn: 'root'` não precisam ser adicionados aqui.
  bootstrap: [AppComponent]
})
export class AppModule { }

```

---

## Informações Adicionais

### Vantagens e Desvantagens da Injeção de Dependência

### Prós:

- **Modularidade e Reusabilidade:** Permite criar módulos independentes que podem ser facilmente reutilizados em diferentes partes da aplicação ou em outros projetos.
- **Testabilidade Aprimorada:** Facilita a criação de testes unitários, pois as dependências podem ser facilmente substituídas por mocks ou stubs, isolando o código a ser testado.
- **Separação de Preocupações:** Ajuda a manter as responsabilidades bem definidas, com componentes focados na UI e serviços na lógica de negócios/dados.
- **Flexibilidade:** Permite alterar as implementações das dependências sem modificar o código que as utiliza, o que é ótimo para refatoração ou troca de APIs.
- **Melhor Desempenho (com lazy loading):** Serviços com `providedIn: 'root'` são *tree-shakable* e *lazy-loaded*, o que significa que o Angular só os incluirá no bundle final se forem realmente usados e só os instanciará quando forem injetados pela primeira vez, otimizando o tamanho do bundle e o tempo de carregamento.

### Contras:

- **Curva de Aprendizagem:** O conceito de injeção de dependência pode ser um pouco complexo para iniciantes.
- **Overhead Inicial:** Pode haver um pequeno "overhead" de configuração e boilerplate no início do projeto.
- **Depuração:** Em aplicações muito grandes, depurar problemas relacionados à injeção de dependência (como provedores errados ou dependências circulares) pode ser um desafio.

### Quando utilizar e quando evitar o uso de serviços

### Quando utilizar:

- **Lógica de Negócios:** Qualquer lógica complexa que não seja diretamente relacionada à apresentação de dados.
- **Acesso a Dados (APIs, Local Storage, etc.):** Encapsular todas as operações de leitura e escrita de dados.
- **Compartilhamento de Estado:** Gerenciar um estado compartilhado entre múltiplos componentes.
- **Utilitários:** Funções auxiliares, como formatação de datas, validação de entradas, etc.
- **Interações com APIs Terceirizadas:** Funções para integrar com serviços externos (ex: Google Maps API).
- **Eventos Globais:** Gerenciar e emitir eventos que precisam ser ouvidos por componentes não relacionados.

### Quando evitar o uso (e considerar alternativas):

- **Lógica de Componente Específica:** Se uma lógica é estritamente específica de um único componente e não será reutilizada, ela pode permanecer no próprio componente.
- **Pequenos Utilitários Locais:** Para funções muito simples e puramente locais a um arquivo, uma função pura exportada ou um método privado podem ser suficientes.
- **Componentes de Apresentação Puros (Dumb Components):** Componentes que apenas recebem dados via `@Input()` e emitem eventos via `@Output()` geralmente não precisam injetar serviços. Eles são mais fáceis de testar sem dependências.

---

## Referências para Estudo Independente

Para aprofundar seus conhecimentos, Gedê, sugiro os seguintes recursos:

- **Documentação Oficial do Angular - Serviços e Injeção de Dependência:**
    - [Angular Docs - Services and dependency injection](https://angular.io/guide/architecture-services)
    - [Angular Docs - Dependency Injection](https://angular.io/guide/dependency-injection)
- **Artigo da Medium - Angular Services vs Components:**
    - [Angular Services vs Components: When to use what](https://www.google.com/search?q=https://medium.com/%40kiran-m-reddy/angular-services-vs-components-when-to-use-what-2c6f13b516b)
- **Curso da Loiane Groner - Angular:**
    - Se você busca um curso mais estruturado e em português, os cursos da Loiane Groner no YouTube ou em plataformas como a Udemy são excelentes para o ecossistema Angular. Procure por "Curso Angular Loiane Groner".
- **Livros sobre Angular:**
    - "Angular Development with TypeScript" by Yakov Fain and Anton Moiseev
    - "Angular in Action" by Jeremy Wilken

Espero que essa explicação detalhada te ajude bastante a dominar os serviços e a injeção de dependência no Angular\! Se tiver mais alguma dúvida, é só chamar, ok?