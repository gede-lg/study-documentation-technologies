# Anotação de Tipo Explícita: Contratos Declarados e Intenção Documentada

## 🎯 Introdução e Definição

Anotação de tipo explícita é a **sintaxe de declaração manual de tipos** usando `: Type` após identificador, onde desenvolvedor especifica tipo exato que variável deve ter, sobrescrevendo inferência automática do TypeScript. Conceitualmente, representa **contrato explícito** entre código e sistema de tipos, documentando intenção e forçando compatibilidade rigorosa.

## 📋 Sumário Conceitual

**Sintaxe:**
```typescript
let variavel: TipoExplicito = valor;
const constante: TipoExplicito = valor;
```

**Aspectos Centrais:**
1. **Override de Inferência:** Tipo manual prevalece sobre inferido
2. **Documentação Viva:** Tipo é parte do código
3. **Validação Bidirecional:** Valor deve ser compatível com tipo anotado
4. **Contratos de Interface:** Especialmente útil em parâmetros e retornos

## 🧠 Fundamentos Teóricos

### Sintaxe de Anotação

**Primitivos:**
```typescript
let idade: number = 30;
let nome: string = "João";
let ativo: boolean = true;
```

**Arrays:**
```typescript
let numeros: number[] = [1, 2, 3];
let palavras: Array<string> = ["a", "b"];
```

**Objetos:**
```typescript
let usuario: { nome: string; idade: number } = {
  nome: "Maria",
  idade: 25
};
```

**Interfaces:**
```typescript
interface Pessoa {
  nome: string;
  idade: number;
}

let pessoa: Pessoa = {
  nome: "Pedro",
  idade: 40
};
```

### Quando Usar Anotação Explícita

**1. Inferência Insuficiente:**
```typescript
let valor: string | number;  // Union type - não pode inferir sem valor
valor = "texto";
valor = 123;
```

**2. Documentação de Intenção:**
```typescript
let config: Config = loadConfig();  // Deixa claro tipo esperado
```

**3. Garantir Tipo Amplo:**
```typescript
const numero: number = 42;  // Tipo: number (não literal 42)
```

**4. Parâmetros de Função:**
```typescript
function somar(a: number, b: number): number {
  return a + b;
}
```

**5. Propriedades de Classe:**
```typescript
class Usuario {
  nome: string;  // Anotação explícita obrigatória
  idade: number;

  constructor(nome: string, idade: number) {
    this.nome = nome;
    this.idade = idade;
  }
}
```

### Anotação vs. Inferência

**Inferência (TypeScript deduz):**
```typescript
let x = 10;  // Tipo inferido: number
```

**Anotação (Você especifica):**
```typescript
let x: number = 10;  // Tipo explícito: number
```

**Quando Inferência é Suficiente:**
```typescript
const pi = 3.14159;  // Inferido: 3.14159 (literal)
const nome = "João";  // Inferido: "João" (literal)
```

**Quando Anotação é Necessária:**
```typescript
let resultado: string | null = null;  // Sem anotação, seria 'null'
resultado = "sucesso";  // OK
```

## 🎯 Aplicabilidade

**Use Anotação Quando:**
- Tipo não pode ser inferido (variável sem valor inicial)
- Quer documentar intenção claramente
- Quer tipo mais amplo que literal inferido
- Definindo contratos (parâmetros, retornos, propriedades)

**Evite Anotação Quando:**
- TypeScript infere corretamente
- Redundante e verbosa
- Valor inicial já deixa tipo claro

**Regra:** **Anote quando necessário ou quando melhora clareza; confie em inferência quando óbvia.**

## 📚 Conclusão

Anotação de tipo explícita é ferramenta poderosa para **documentar contratos** e **forçar compatibilidade**. Balance entre explicitação (clareza, contratos) e inferência (concisão, DRY).

**Use anotações estrategicamente: interfaces públicas (parâmetros, retornos), configurações ambíguas; confie em inferência para variáveis locais óbvias.**
