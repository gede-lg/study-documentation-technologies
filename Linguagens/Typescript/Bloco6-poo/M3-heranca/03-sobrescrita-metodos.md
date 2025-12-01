# Sobrescrita de Métodos (Override): Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Method overriding** (sobrescrita de métodos) permite que subclasse forneça **implementação específica** de método já definido na classe pai, substituindo comportamento herdado. Conceitualmente, representa **especialização comportamental**, onde subclasse mantém mesma interface (assinatura) mas altera lógica interna do método.

Na essência, override materializa o princípio de **polimorfismo por subtipagem**, permitindo que diferentes subclasses respondam ao mesmo método de formas específicas, criando comportamento dinâmico baseado no tipo real do objeto.

## 📋 Fundamentos

### Sintaxe e Comportamento

```typescript
class Animal {
  nome: string;

  constructor(nome: string) {
    this.nome = nome;
  }

  emitirSom(): string {
    return "Som genérico";
  }

  mover(): void {
    console.log(`${this.nome} está se movendo`);
  }
}

class Cachorro extends Animal {
  // Sobrescreve método da classe pai
  emitirSom(): string {
    return "Au au!";
  }

  // Herda mover() sem sobrescrever
}

class Gato extends Animal {
  emitirSom(): string {
    return "Miau!";
  }

  // Sobrescreve mover() com comportamento diferente
  mover(): void {
    console.log(`${this.nome} está andando silenciosamente`);
  }
}

const dog = new Cachorro("Rex");
const cat = new Gato("Mimi");

console.log(dog.emitirSom()); // "Au au!" - sobrescrito
console.log(cat.emitirSom()); // "Miau!" - sobrescrito
dog.mover(); // Usa implementação herdada
cat.mover(); // Usa implementação sobrescrita
```

**Conceito-chave:** Método sobrescrito tem **mesma assinatura** (nome, parâmetros, retorno) mas **implementação diferente**.

### Assinatura Deve Ser Compatível

```typescript
class Base {
  processar(valor: number): string {
    return valor.toString();
  }
}

class Derivada1 extends Base {
  // ✅ Override válido - mesma assinatura
  processar(valor: number): string {
    return `Processado: ${valor}`;
  }
}

class Derivada2 extends Base {
  // ❌ Erro - assinatura incompatível (parâmetro diferente)
  // processar(valor: string): string {
  //   return valor;
  // }
}

class Derivada3 extends Base {
  // ❌ Erro - tipo de retorno incompatível
  // processar(valor: number): number {
  //   return valor;
  // }
}

class Derivada4 extends Base {
  // ✅ Retorno mais específico é permitido (covariance)
  processar(valor: number): "ok" | "erro" {
    return valor > 0 ? "ok" : "erro";
  }
}
```

## 🔍 Análise Conceitual

### 1. Polimorfismo em Ação

```typescript
class Forma {
  calcularArea(): number {
    return 0;
  }

  descricao(): string {
    return "Forma genérica";
  }
}

class Circulo extends Forma {
  constructor(private raio: number) {
    super();
  }

  calcularArea(): number {
    return Math.PI * this.raio ** 2;
  }

  descricao(): string {
    return `Círculo de raio ${this.raio}`;
  }
}

class Retangulo extends Forma {
  constructor(private largura: number, private altura: number) {
    super();
  }

  calcularArea(): number {
    return this.largura * this.altura;
  }

  descricao(): string {
    return `Retângulo ${this.largura}x${this.altura}`;
  }
}

// Polimorfismo - mesmo código funciona para diferentes tipos
function exibirInfo(forma: Forma): void {
  console.log(forma.descricao());
  console.log(`Área: ${forma.calcularArea()}`);
}

exibirInfo(new Circulo(5));      // Chama métodos de Circulo
exibirInfo(new Retangulo(4, 6)); // Chama métodos de Retangulo
```

**Conceito:** Método chamado depende do **tipo real do objeto em runtime**, não do tipo da variável.

### 2. Modificador Override (TypeScript 4.3+)

```typescript
class Animal {
  emitirSom(): string {
    return "Som";
  }
}

class Cachorro extends Animal {
  // ✅ Palavra-chave 'override' documenta intenção
  override emitirSom(): string {
    return "Au au!";
  }
}

class Gato extends Animal {
  // ❌ Erro com --noImplicitOverride: método sem 'override'
  emitirSom(): string {
    return "Miau!";
  }
}

class Passaro extends Animal {
  // ❌ Erro: 'override' mas método não existe na classe pai
  // override voar(): void {
  //   console.log("Voando");
  // }
}
```

**Benefício:** `override` previne erros de digitação no nome do método.

### 3. Acesso a Membros Protected

```typescript
class Veiculo {
  protected velocidade: number = 0;

  acelerar(): void {
    this.velocidade += 10;
  }

  getVelocidade(): number {
    return this.velocidade;
  }
}

class Carro extends Veiculo {
  // Sobrescreve com acesso a protected da classe pai
  acelerar(): void {
    if (this.velocidade < 120) {
      this.velocidade += 20; // Acessa protected
    }
  }
}

class Moto extends Veiculo {
  acelerar(): void {
    this.velocidade += 30; // Acelera ainda mais rápido
  }
}
```

### 4. Sobrescrita Parcial (Template Method)

```typescript
class ProcessadorDados {
  public processar(dados: any[]): any[] {
    this.validar(dados);
    const transformados = this.transformar(dados);
    this.salvar(transformados);
    return transformados;
  }

  protected validar(dados: any[]): void {
    console.log("Validação padrão");
  }

  protected transformar(dados: any[]): any[] {
    return dados; // Implementação padrão
  }

  protected salvar(dados: any[]): void {
    console.log("Salvando dados");
  }
}

class ProcessadorCSV extends ProcessadorDados {
  // Sobrescreve apenas transformar()
  protected transformar(dados: any[]): any[] {
    return dados.map(item => ({
      ...item,
      tipo: "CSV"
    }));
  }

  // validar() e salvar() usam implementação da classe pai
}
```

### 5. Covariance em Tipos de Retorno

```typescript
class Animal {
  criar(): Animal {
    return new Animal();
  }
}

class Cachorro extends Animal {
  // ✅ Retorno mais específico (covariant)
  criar(): Cachorro {
    return new Cachorro();
  }
}

const dog = new Cachorro();
const novoDog = dog.criar(); // Tipo: Cachorro, não Animal
```

## 🎯 Aplicabilidade

### Strategy Pattern

```typescript
abstract class PaymentStrategy {
  abstract processar(valor: number): boolean;
}

class CartaoCreditoStrategy extends PaymentStrategy {
  processar(valor: number): boolean {
    console.log(`Processando R$ ${valor} no cartão`);
    return true;
  }
}

class PixStrategy extends PaymentStrategy {
  processar(valor: number): boolean {
    console.log(`Gerando QR Code PIX para R$ ${valor}`);
    return true;
  }
}

class BoletoStrategy extends PaymentStrategy {
  processar(valor: number): boolean {
    console.log(`Gerando boleto de R$ ${valor}`);
    return true;
  }
}

class Pagamento {
  constructor(private strategy: PaymentStrategy) {}

  executar(valor: number): boolean {
    return this.strategy.processar(valor);
  }
}
```

### Hooks em Frameworks

```typescript
abstract class Component {
  public inicializar(): void {
    this.antesDeMontar();
    this.montar();
    this.depoisDeMontar();
  }

  protected antesDeMontar(): void {
    // Hook - subclasse pode sobrescrever
  }

  protected abstract montar(): void;

  protected depoisDeMontar(): void {
    // Hook - subclasse pode sobrescrever
  }
}

class BotaoComponent extends Component {
  protected antesDeMontar(): void {
    console.log("Preparando botão");
  }

  protected montar(): void {
    console.log("Montando botão");
  }

  protected depoisDeMontar(): void {
    console.log("Adicionando event listeners");
  }
}
```

### Validação Customizada

```typescript
class Formulario {
  validar(): boolean {
    return this.validarCampos() && this.validarRegras();
  }

  protected validarCampos(): boolean {
    return true; // Validação básica
  }

  protected validarRegras(): boolean {
    return true; // Sem regras por padrão
  }
}

class FormularioCadastro extends Formulario {
  protected validarCampos(): boolean {
    // Validações específicas de cadastro
    return this.validarEmail() && this.validarSenha();
  }

  protected validarRegras(): boolean {
    // Regras de negócio específicas
    return this.idadeMinima() && this.documentoUnico();
  }

  private validarEmail(): boolean { return true; }
  private validarSenha(): boolean { return true; }
  private idadeMinima(): boolean { return true; }
  private documentoUnico(): boolean { return true; }
}
```

## ⚠️ Considerações

### 1. Princípio de Substituição de Liskov

```typescript
class Retangulo {
  constructor(
    protected largura: number,
    protected altura: number
  ) {}

  setLargura(valor: number): void {
    this.largura = valor;
  }

  setAltura(valor: number): void {
    this.altura = valor;
  }

  area(): number {
    return this.largura * this.altura;
  }
}

// ❌ Viola Liskov - Quadrado não é substituível por Retângulo
class Quadrado extends Retangulo {
  setLargura(valor: number): void {
    this.largura = valor;
    this.altura = valor; // Quebra expectativa
  }

  setAltura(valor: number): void {
    this.largura = valor;
    this.altura = valor; // Quebra expectativa
  }
}

function testar(ret: Retangulo): void {
  ret.setLargura(5);
  ret.setAltura(10);
  console.log(ret.area()); // Espera 50, mas Quadrado dá 100
}
```

### 2. Não Enfraquecer Precondições

```typescript
class Base {
  processar(valor: number): void {
    if (valor < 0) throw new Error("Valor deve ser positivo");
    // processar...
  }
}

// ❌ Ruim - enfraquece precondição
class Derivada extends Base {
  processar(valor: number): void {
    // Remove validação - aceita negativos
    // Quebra contrato da classe pai
  }
}
```

### 3. Não Fortalecer Poscondições

```typescript
// Contrato: retorna array não-vazio
class Base {
  buscar(): string[] {
    return ["item"];
  }
}

// ❌ Ruim - fortalece poscondição
class Derivada extends Base {
  buscar(): string[] {
    return []; // Pode retornar vazio - quebra garantia
  }
}
```

## 📚 Conclusão

Override permite subclasse fornecer implementação específica de método herdado, mantendo mesma assinatura mas alterando comportamento. É fundamental para polimorfismo, permitindo código genérico que funciona com diferentes tipos. Deve respeitar princípio de substituição de Liskov - subclasse deve ser substituível por classe pai sem quebrar funcionalidade.
