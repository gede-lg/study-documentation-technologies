# Property Narrowing: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Property narrowing** é técnica de **type narrowing** baseada na **presença ou valor de propriedades** de objeto, usando operadores `in`, comparações de propriedades e verificação de existência para refinar tipos. Conceitualmente, representa **structure-based discrimination**, onde forma/estrutura do objeto determina tipo específico através de análise de suas propriedades.

Na essência, materializa o princípio de **duck typing estaticamente verificado**, onde TypeScript infere tipo baseado nas propriedades que objeto possui, permitindo narrowing sem necessidade de discriminants explícitos ou type guards customizados.

## 📋 Fundamentos

### Operador 'in'

```typescript
interface Cachorro {
  latir: () => void;
  raça: string;
}

interface Gato {
  miar: () => void;
  pelagem: string;
}

type Animal = Cachorro | Gato;

function fazerBarulho(animal: Animal): void {
  if ("latir" in animal) {
    // animal: Cachorro (tem propriedade 'latir')
    animal.latir();
    console.log(`Raça: ${animal.raça}`);
  } else {
    // animal: Gato (não tem 'latir', então tem 'miar')
    animal.miar();
    console.log(`Pelagem: ${animal.pelagem}`);
  }
}

const dog: Cachorro = {
  latir: () => console.log("Au au!"),
  raça: "Labrador"
};

const cat: Gato = {
  miar: () => console.log("Miau!"),
  pelagem: "Preta"
};

fazerBarulho(dog); // "Au au!" "Raça: Labrador"
fazerBarulho(cat); // "Miau!" "Pelagem: Preta"
```

**Conceito-chave:** Operador `in` verifica **presença de propriedade** e TypeScript usa isso para narrowing.

### Truthiness Check

```typescript
interface Usuario {
  nome: string;
  email?: string; // Opcional
}

function enviarEmail(usuario: Usuario): void {
  // Verificar se propriedade existe e é truthy
  if (usuario.email) {
    // usuario.email: string (não undefined)
    console.log(`Enviando para: ${usuario.email}`);
  } else {
    console.log("Email não disponível");
  }
}

const u1: Usuario = { nome: "Ana", email: "ana@example.com" };
const u2: Usuario = { nome: "Bob" }; // sem email

enviarEmail(u1); // "Enviando para: ana@example.com"
enviarEmail(u2); // "Email não disponível"
```

## 🔍 Análise Conceitual

### 1. Verificação de Propriedades Opcionais

```typescript
interface Config {
  host: string;
  port?: number;
  timeout?: number;
  ssl?: {
    cert: string;
    key: string;
  };
}

function aplicarConfig(config: Config): void {
  console.log(`Host: ${config.host}`);

  // Narrowing de propriedade opcional
  if (config.port) {
    // config.port: number (não undefined)
    console.log(`Porta: ${config.port}`);
  }

  if (config.timeout !== undefined) {
    // Melhor: verifica explicitamente undefined
    // Permite 0 como valor válido
    console.log(`Timeout: ${config.timeout}ms`);
  }

  if (config.ssl) {
    // config.ssl: { cert: string; key: string } (não undefined)
    console.log(`SSL cert: ${config.ssl.cert}`);
    console.log(`SSL key: ${config.ssl.key}`);
  }
}
```

### 2. Union Types sem Discriminant

```typescript
interface Circle {
  radius: number;
}

interface Rectangle {
  width: number;
  height: number;
}

interface Triangle {
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

function calcularArea(shape: Shape): number {
  if ("radius" in shape) {
    // shape: Circle
    return Math.PI * shape.radius ** 2;
  }

  if ("width" in shape) {
    // shape: Rectangle (tem width mas não radius)
    return shape.width * shape.height;
  }

  // shape: Triangle (único restante)
  return (shape.base * shape.height) / 2;
}

const circle: Circle = { radius: 10 };
const rect: Rectangle = { width: 5, height: 10 };
const triangle: Triangle = { base: 6, height: 8 };

console.log(calcularArea(circle)); // 314.159...
console.log(calcularArea(rect)); // 50
console.log(calcularArea(triangle)); // 24
```

### 3. Verificação de Múltiplas Propriedades

```typescript
interface Pessoa {
  nome: string;
  cpf?: string;
  passaporte?: string;
}

function validarDocumento(pessoa: Pessoa): boolean {
  // Verificar qual documento está presente
  if ("cpf" in pessoa && pessoa.cpf) {
    console.log(`CPF: ${pessoa.cpf}`);
    return validarCPF(pessoa.cpf);
  }

  if ("passaporte" in pessoa && pessoa.passaporte) {
    console.log(`Passaporte: ${pessoa.passaporte}`);
    return validarPassaporte(pessoa.passaporte);
  }

  console.log("Nenhum documento fornecido");
  return false;
}

function validarCPF(cpf: string): boolean {
  return cpf.length === 11;
}

function validarPassaporte(pass: string): boolean {
  return pass.length > 5;
}
```

### 4. Propriedades com Valores Específicos

```typescript
interface Success {
  ok: true;
  data: any;
}

interface Failure {
  ok: false;
  error: string;
}

type Result = Success | Failure;

function processar(result: Result): void {
  // Narrowing baseado em valor da propriedade
  if (result.ok) {
    // result: Success (ok é true)
    console.log("Dados:", result.data);
  } else {
    // result: Failure (ok é false)
    console.error("Erro:", result.error);
  }
}

// Similar a discriminated union mas usando boolean
```

### 5. Nullish Coalescing e Optional Chaining

```typescript
interface Usuario {
  nome: string;
  endereco?: {
    rua: string;
    cidade: string;
    estado?: {
      sigla: string;
      nome: string;
    };
  };
}

function obterEstado(usuario: Usuario): string {
  // Optional chaining + narrowing
  const estado = usuario.endereco?.estado;

  if (estado) {
    // estado: { sigla: string; nome: string } (não undefined)
    return `${estado.nome} (${estado.sigla})`;
  }

  return "Estado não informado";
}

// Nullish coalescing
function obterCidade(usuario: Usuario): string {
  // Se endereco existir, retorna cidade; senão "Desconhecida"
  return usuario.endereco?.cidade ?? "Desconhecida";
}
```

## 🎯 Aplicabilidade

### API Response Handling

```typescript
interface SuccessResponse {
  data: any;
  // error não existe
}

interface ErrorResponse {
  error: string;
  code: number;
  // data não existe
}

type Response = SuccessResponse | ErrorResponse;

function handleResponse(response: Response): void {
  if ("error" in response) {
    // response: ErrorResponse
    console.error(`Erro ${response.code}: ${response.error}`);
  } else {
    // response: SuccessResponse
    console.log("Dados:", response.data);
  }
}
```

### Event Handling

```typescript
interface MouseEventData {
  type: "mouse";
  x: number;
  y: number;
  button: number;
}

interface KeyboardEventData {
  type: "keyboard";
  key: string;
  ctrlKey: boolean;
}

type EventData = MouseEventData | KeyboardEventData;

function handleEvent(event: EventData): void {
  console.log(`Tipo: ${event.type}`);

  if ("x" in event) {
    // event: MouseEventData
    console.log(`Mouse em (${event.x}, ${event.y})`);
    console.log(`Botão: ${event.button}`);
  } else {
    // event: KeyboardEventData
    console.log(`Tecla: ${event.key}`);
    console.log(`Ctrl: ${event.ctrlKey}`);
  }
}
```

### Form Validation

```typescript
interface FormBase {
  nome: string;
  email: string;
}

interface FormComTelefone extends FormBase {
  telefone: string;
}

function enviarFormulario(form: FormBase | FormComTelefone): void {
  console.log(`Nome: ${form.nome}`);
  console.log(`Email: ${form.email}`);

  if ("telefone" in form) {
    // form: FormComTelefone
    console.log(`Telefone: ${form.telefone}`);
  }
}
```

### Plugin System

```typescript
interface BasePlugin {
  name: string;
  version: string;
}

interface LifecyclePlugin extends BasePlugin {
  onInit?: () => void;
  onDestroy?: () => void;
}

interface RenderPlugin extends BasePlugin {
  render: () => void;
}

type Plugin = LifecyclePlugin | RenderPlugin;

function initPlugin(plugin: Plugin): void {
  console.log(`Inicializando ${plugin.name} v${plugin.version}`);

  if ("render" in plugin) {
    // plugin: RenderPlugin
    plugin.render();
  }

  if ("onInit" in plugin && plugin.onInit) {
    // plugin: LifecyclePlugin com onInit definido
    plugin.onInit();
  }
}
```

### Feature Detection

```typescript
interface BasicFeatures {
  nome: string;
}

interface AdvancedFeatures extends BasicFeatures {
  analytics?: () => void;
  notifications?: () => void;
  darkMode?: boolean;
}

function configureApp(features: AdvancedFeatures): void {
  console.log(`App: ${features.nome}`);

  if (features.analytics) {
    console.log("Analytics habilitado");
    features.analytics();
  }

  if (features.notifications) {
    console.log("Notificações habilitadas");
    features.notifications();
  }

  if (features.darkMode !== undefined) {
    console.log(`Dark mode: ${features.darkMode ? "ON" : "OFF"}`);
  }
}
```

## ⚠️ Considerações

### 1. 'in' vs Truthiness

```typescript
interface Config {
  debug?: boolean;
  timeout?: number;
}

function test(config: Config) {
  // ❌ Pode falhar se debug for false
  if (config.debug) {
    // Não entra se debug for false (mas está presente!)
  }

  // ✅ Verifica presença, não valor
  if ("debug" in config) {
    // Entra mesmo se debug for false
    console.log(`Debug: ${config.debug}`);
  }

  // ✅ Verifica undefined explicitamente
  if (config.timeout !== undefined) {
    // Funciona mesmo se timeout for 0
    console.log(`Timeout: ${config.timeout}`);
  }
}
```

### 2. Inherited Properties

```typescript
// 'in' verifica prototype chain
class Animal {
  nome = "Animal";
}

class Cachorro extends Animal {
  latir() {}
}

const dog = new Cachorro();

console.log("nome" in dog); // true (herdado)
console.log("latir" in dog); // true (próprio)
console.log("miar" in dog); // false
```

### 3. Optional vs Nullable

```typescript
interface Usuario {
  email?: string; // string | undefined
  telefone: string | null; // explicitamente nullable
}

function test(user: Usuario) {
  // email: verificar presença
  if (user.email) {
    // email: string (não undefined)
  }

  // telefone: verificar null
  if (user.telefone !== null) {
    // telefone: string (não null)
  }
}
```

### 4. Performance

```typescript
// 'in' pode ser mais lento que discriminant
// Para unions grandes, prefira discriminated unions

// ❌ Pode ser lento
type BigUnion = TypeA | TypeB | TypeC | TypeD | TypeE;

function process(obj: BigUnion) {
  if ("propA" in obj) { /* ... */ }
  else if ("propB" in obj) { /* ... */ }
  // ...
}

// ✅ Mais rápido
interface TypeA { type: "A"; propA: string }
interface TypeB { type: "B"; propB: number }

type FastUnion = TypeA | TypeB;

function processFast(obj: FastUnion) {
  switch (obj.type) {
    case "A": /* ... */ break;
    case "B": /* ... */ break;
  }
}
```

## 📚 Conclusão

Property narrowing usa operador `in`, truthiness checks e comparações de propriedades para refinar tipos baseado em estrutura de objetos. Permite narrowing de unions sem discriminants explícitos, verificação de propriedades opcionais e feature detection. Use `in` para verificar presença (considera prototype chain), truthiness para valores non-falsy, `!== undefined` para permitir valores falsy mas definidos. Combine com optional chaining (`?.`) e nullish coalescing (`??`) para código conciso. Para unions grandes, discriminated unions são mais performáticas. Property narrowing é duck typing estaticamente verificado.
