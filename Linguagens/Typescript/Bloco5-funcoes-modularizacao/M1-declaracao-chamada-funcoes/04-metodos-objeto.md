# Métodos de Objeto em TypeScript

## 🎯 Introdução

**Métodos de objeto** são funções definidas como propriedades de objetos, oferecendo **encapsulamento de comportamento** relacionado aos dados do objeto, com sintaxe concisa e acesso ao contexto via `this`.

## 📋 Conceitos Fundamentais

### Sintaxe de Métodos

```typescript
// Objeto literal com métodos
const calculadora = {
  // Método com sintaxe curta (ES6+)
  somar(a: number, b: number): number {
    return a + b;
  },
  
  // Método como propriedade function expression
  subtrair: function(a: number, b: number): number {
    return a - b;
  },
  
  // Método como propriedade arrow function
  multiplicar: (a: number, b: number): number => {
    return a * b;
  }
};

calculadora.somar(5, 3); // 8
calculadora.subtrair(10, 4); // 6
calculadora.multiplicar(2, 3); // 6
```

### Acesso a this

```typescript
const usuario = {
  nome: "Ana",
  idade: 25,
  
  // Método acessa propriedades via this
  apresentar(): string {
    return `Olá, meu nome é ${this.nome} e tenho ${this.idade} anos`;
  }
};

console.log(usuario.apresentar());
// "Olá, meu nome é Ana e tenho 25 anos"
```

## 🧠 Fundamentos Teóricos

### Tipos de Definição de Métodos

#### Sintaxe Curta de Método (Recomendada)

```typescript
const objeto = {
  metodo(parametro: string): string {
    return `Processado: ${parametro}`;
  }
};

// ✅ Vantagens:
// - Sintaxe concisa
// - this dinâmico (esperado em métodos)
// - Padrão ES6+
```

#### Propriedade Function Expression

```typescript
const objeto = {
  metodo: function(parametro: string): string {
    return `Processado: ${parametro}`;
  }
};

// ⚠️ Verboso, menos usado
// Funciona igual à sintaxe curta
```

#### Propriedade Arrow Function

```typescript
const objeto = {
  metodo: (parametro: string): string => {
    return `Processado: ${parametro}`;
  }
};

// ⚠️ Cuidado: this léxico, não dinâmico
// Não acessa propriedades do objeto via this
```

### Tipagem de Métodos em Interfaces

```typescript
interface Usuario {
  nome: string;
  idade: number;
  
  // Método tipado
  apresentar(): string;
  
  // Método com parâmetros
  atualizarIdade(novaIdade: number): void;
}

const usuario: Usuario = {
  nome: "Ana",
  idade: 25,
  
  apresentar(): string {
    return `${this.nome}, ${this.idade} anos`;
  },
  
  atualizarIdade(novaIdade: number): void {
    this.idade = novaIdade;
  }
};
```

### Métodos em Type Aliases

```typescript
type Calculadora = {
  valor: number;
  
  // Métodos definidos como assinaturas de função
  somar(n: number): number;
  subtrair(n: number): number;
  reset(): void;
};

const calc: Calculadora = {
  valor: 0,
  
  somar(n: number): number {
    this.valor += n;
    return this.valor;
  },
  
  subtrair(n: number): number {
    this.valor -= n;
    return this.valor;
  },
  
  reset(): void {
    this.valor = 0;
  }
};

calc.somar(10); // 10
calc.somar(5); // 15
calc.subtrair(3); // 12
```

## 🔍 Análise Conceitual Profunda

### This Binding em Métodos

#### Método Tradicional: this Dinâmico

```typescript
const contador = {
  count: 0,
  
  incrementar(): void {
    this.count++; // this é contador
  }
};

contador.incrementar();
console.log(contador.count); // 1

// Mas this pode mudar se método for extraído
const inc = contador.incrementar;
inc(); // ❌ Erro: this é undefined em strict mode
```

#### Arrow Function: this Léxico

```typescript
const contador = {
  count: 0,
  
  // ⚠️ Arrow function: this não é contador!
  incrementar: (): void => {
    this.count++; // this é escopo externo, não contador
  }
};

contador.incrementar(); // Não funciona como esperado
```

#### Solução para Métodos Extraídos

```typescript
const contador = {
  count: 0,
  
  // Método tradicional
  incrementar(): void {
    this.count++;
  },
  
  // Arrow function que chama método: preserva this
  incrementarSeguro: function(): void {
    setTimeout((): void => {
      this.incrementar(); // this é contador
    }, 1000);
  }
};
```

### Métodos com Generics

```typescript
interface Repositorio<T> {
  itens: T[];
  
  adicionar(item: T): void;
  buscar(predicate: (item: T) => boolean): T | undefined;
  listar(): T[];
}

const repositorioUsuarios: Repositorio<{ id: number; nome: string }> = {
  itens: [],
  
  adicionar(item): void {
    this.itens.push(item);
  },
  
  buscar(predicate): { id: number; nome: string } | undefined {
    return this.itens.find(predicate);
  },
  
  listar(): { id: number; nome: string }[] {
    return this.itens;
  }
};

repositorioUsuarios.adicionar({ id: 1, nome: "Ana" });
const usuario = repositorioUsuarios.buscar((u) => u.id === 1);
```

### Métodos Opcionais

```typescript
interface Configuracao {
  host: string;
  port: number;
  
  // Método opcional
  validar?(): boolean;
  
  // Método obrigatório
  conectar(): void;
}

const config: Configuracao = {
  host: "localhost",
  port: 3000,
  
  // validar não implementado (opcional)
  
  conectar(): void {
    console.log(`Conectando em ${this.host}:${this.port}`);
  }
};

// Chamar método opcional: verificar existência
if (config.validar) {
  config.validar();
}
```

### Getters e Setters

```typescript
const usuario = {
  _nome: "Ana",
  _idade: 25,
  
  // Getter: acessa como propriedade
  get nome(): string {
    return this._nome;
  },
  
  // Setter: atribui como propriedade
  set nome(novoNome: string) {
    if (novoNome.length < 3) {
      throw new Error("Nome muito curto");
    }
    this._nome = novoNome;
  },
  
  get idade(): number {
    return this._idade;
  },
  
  set idade(novaIdade: number) {
    if (novaIdade < 0) {
      throw new Error("Idade inválida");
    }
    this._idade = novaIdade;
  }
};

// Uso como propriedades
console.log(usuario.nome); // "Ana"
usuario.nome = "Bruno"; // Chama setter
console.log(usuario.nome); // "Bruno"

usuario.idade = -5; // ❌ Erro: Idade inválida
```

## 🎯 Aplicabilidade

### Objeto de Configuração com Métodos

```typescript
type Ambiente = "desenvolvimento" | "producao";

const config = {
  ambiente: "desenvolvimento" as Ambiente,
  apiUrl: "https://api-dev.example.com",
  debug: true,
  
  ehProducao(): boolean {
    return this.ambiente === "producao";
  },
  
  obterApiUrl(): string {
    return this.ehProducao()
      ? "https://api.example.com"
      : this.apiUrl;
  },
  
  alternarDebug(): void {
    this.debug = !this.debug;
  }
};

if (config.ehProducao()) {
  console.log("Ambiente de produção");
}

const url = config.obterApiUrl();
```

### State Management Simples

```typescript
type Estado = {
  contador: number;
  usuario: { nome: string; email: string } | null;
  
  incrementar(): void;
  decrementar(): void;
  definirUsuario(nome: string, email: string): void;
  limparUsuario(): void;
  obterEstado(): { contador: number; usuario: any };
};

const estado: Estado = {
  contador: 0,
  usuario: null,
  
  incrementar(): void {
    this.contador++;
  },
  
  decrementar(): void {
    this.contador--;
  },
  
  definirUsuario(nome: string, email: string): void {
    this.usuario = { nome, email };
  },
  
  limparUsuario(): void {
    this.usuario = null;
  },
  
  obterEstado() {
    return {
      contador: this.contador,
      usuario: this.usuario
    };
  }
};

estado.incrementar();
estado.definirUsuario("Ana", "ana@email.com");
console.log(estado.obterEstado());
```

### Validadores

```typescript
const validador = {
  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
  
  validarSenha(senha: string): { valida: boolean; erros: string[] } {
    const erros: string[] = [];
    
    if (senha.length < 8) {
      erros.push("Senha deve ter pelo menos 8 caracteres");
    }
    
    if (!/[A-Z]/.test(senha)) {
      erros.push("Senha deve ter letra maiúscula");
    }
    
    if (!/[0-9]/.test(senha)) {
      erros.push("Senha deve ter número");
    }
    
    return {
      valida: erros.length === 0,
      erros
    };
  },
  
  validarCPF(cpf: string): boolean {
    // lógica de validação...
    return cpf.length === 11;
  }
};

const emailValido = validador.validarEmail("teste@email.com");
const senhaValidacao = validador.validarSenha("Abc123");
```

### Formatadores

```typescript
const formatador = {
  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  },
  
  formatarData(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR').format(data);
  },
  
  formatarTelefone(telefone: string): string {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  },
  
  formatarCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
};

console.log(formatador.formatarMoeda(1234.56)); // "R$ 1.234,56"
console.log(formatador.formatarTelefone("11987654321")); // "(11) 98765-4321"
```

### API Client Object

```typescript
const apiClient = {
  baseUrl: "https://api.example.com",
  token: null as string | null,
  
  setToken(token: string): void {
    this.token = token;
  },
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.obterHeaders()
    });
    return response.json();
  },
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.obterHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  obterHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    
    return headers;
  }
};

apiClient.setToken("abc123");
const usuarios = await apiClient.get("/usuarios");
```

## ⚠️ Limitações

### Arrow Functions Não Têm this Dinâmico

```typescript
const objeto = {
  valor: 10,
  
  // ❌ Não funciona: this não é objeto
  dobrar: (): number => {
    return this.valor * 2; // this é escopo externo
  },
  
  // ✅ Funciona: this é objeto
  triplicar(): number {
    return this.valor * 3;
  }
};

objeto.dobrar(); // Não retorna 20
objeto.triplicar(); // Retorna 30
```

### Métodos Extraídos Perdem Contexto

```typescript
const contador = {
  count: 0,
  
  incrementar(): void {
    this.count++;
  }
};

const inc = contador.incrementar;
inc(); // ❌ this é undefined, não contador

// ✅ Solução: bind
const incBound = contador.incrementar.bind(contador);
incBound(); // this é contador
```

### Métodos em Objetos Literais Não São Compartilhados

```typescript
// Cada objeto tem cópia do método (memória)
const criar = (nome: string) => ({
  nome,
  
  // Novo método criado para cada objeto
  saudar(): string {
    return `Olá, ${this.nome}`;
  }
});

const obj1 = criar("Ana");
const obj2 = criar("Bruno");

// obj1.saudar !== obj2.saudar (métodos diferentes)

// ✅ Use classes para compartilhar métodos via prototype
```

## 🔗 Interconexões

### Com Classes

```typescript
// Métodos em objeto literal
const contadorLiteral = {
  count: 0,
  incrementar(): void {
    this.count++;
  }
};

// Métodos em classe (compartilhados via prototype)
class Contador {
  count = 0;
  
  incrementar(): void {
    this.count++;
  }
}

const c1 = new Contador();
const c2 = new Contador();

// c1.incrementar === c2.incrementar (mesmo método no prototype)
```

### Com Interfaces

```typescript
interface Shape {
  calcularArea(): number;
  calcularPerimetro(): number;
}

const retangulo: Shape = {
  largura: 10,
  altura: 5,
  
  calcularArea(): number {
    return this.largura * this.altura;
  },
  
  calcularPerimetro(): number {
    return 2 * (this.largura + this.altura);
  }
} as any; // cast necessário pois largura/altura não estão na interface
```

### Com Type Guards

```typescript
const utilitarios = {
  isString(valor: unknown): valor is string {
    return typeof valor === "string";
  },
  
  isNumber(valor: unknown): valor is number {
    return typeof valor === "number";
  },
  
  isArray<T>(valor: unknown): valor is T[] {
    return Array.isArray(valor);
  }
};

const valor: unknown = "texto";

if (utilitarios.isString(valor)) {
  console.log(valor.toUpperCase()); // TypeScript sabe que é string
}
```

## 📚 Conclusão

**Métodos de objeto** em TypeScript oferecem:

✅ Encapsulamento de comportamento com dados  
✅ Acesso a propriedades via `this`  
✅ Sintaxe concisa (method shorthand)  
✅ Tipagem forte de parâmetros e retorno  
✅ Getters/setters para controle de acesso  

Use métodos de objeto quando:
- Quer agrupar comportamento relacionado a dados
- Precisa acessar propriedades do objeto via this
- Cria objetos de configuração/utilitários
- Implementa interfaces com comportamento
- Quer encapsulamento simples sem classes

Métodos de objeto são **fundamentais para organização de código** em objetos literais, complementando classes para estruturas mais leves.
