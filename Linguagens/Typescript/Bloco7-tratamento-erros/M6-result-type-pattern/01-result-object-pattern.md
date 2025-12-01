# Result Object Pattern: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Result Object Pattern** é padrão de retorno de função que **encapsula sucesso ou falha em objeto estruturado**, contendo `success: boolean` e dados (`data`) ou erro (`error`) condicionalmente. Conceitualmente, representa **erro como valor**, onde falhas são tratadas como resultados explícitos ao invés de exceções, tornando fluxo de erro parte da lógica normal do programa.

Na essência, Result Pattern materializa o princípio de **error handling funcional**, inspirado em linguagens como Rust (`Result<T, E>`) e Haskell (`Either`), onde erro não é excepcional mas sim possibilidade explícita no tipo de retorno.

## 📋 Fundamentos

### Estrutura Básica

```typescript
// Tipo Result genérico
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Função que retorna Result
function dividir(a: number, b: number): Result<number> {
  if (b === 0) {
    return {
      success: false,
      error: "Divisão por zero não permitida"
    };
  }

  return {
    success: true,
    data: a / b
  };
}

// Uso
const resultado = dividir(10, 2);

if (resultado.success) {
  console.log(`Resultado: ${resultado.data}`); // data está garantido
} else {
  console.error(`Erro: ${resultado.error}`); // error está garantido
}
```

**Conceito-chave:** Erro é **retornado** como valor, não **lançado** como exceção.

### Comparação com Try/Catch

```typescript
// ❌ Abordagem tradicional com exceções
function dividirComExcecao(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Divisão por zero");
  }
  return a / b;
}

try {
  const resultado = dividirComExcecao(10, 0);
  console.log(resultado);
} catch (erro) {
  console.error(erro);
}

// ✅ Abordagem com Result Pattern
function dividirComResult(a: number, b: number): Result<number> {
  if (b === 0) {
    return { success: false, error: "Divisão por zero" };
  }
  return { success: true, data: a / b };
}

const resultado = dividirComResult(10, 0);
if (resultado.success) {
  console.log(resultado.data);
} else {
  console.error(resultado.error);
}
```

**Vantagens:**
- Erro explícito no tipo de retorno
- Força tratamento de erro
- Fluxo de controle mais previsível
- Sem overhead de exceções

## 🔍 Análise Conceitual

### 1. Result Genérico com Tipo de Erro

```typescript
interface Result<T, E = string> {
  success: boolean;
  data?: T;
  error?: E;
}

// Tipo de erro customizado
interface ValidationError {
  campo: string;
  mensagem: string;
}

function validarEmail(email: string): Result<string, ValidationError> {
  if (!email.includes("@")) {
    return {
      success: false,
      error: {
        campo: "email",
        mensagem: "Email deve conter @"
      }
    };
  }

  return {
    success: true,
    data: email
  };
}

const resultado = validarEmail("invalido");
if (!resultado.success) {
  console.log(`Campo ${resultado.error!.campo}: ${resultado.error!.mensagem}`);
}
```

### 2. Operações Assíncronas

```typescript
async function buscarUsuario(id: number): Promise<Result<Usuario>> {
  try {
    const response = await fetch(`/api/usuarios/${id}`);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (erro) {
    return {
      success: false,
      error: `Erro de rede: ${erro instanceof Error ? erro.message : "Desconhecido"}`
    };
  }
}

// Uso
const resultado = await buscarUsuario(1);

if (resultado.success) {
  console.log(`Usuário: ${resultado.data.nome}`);
} else {
  console.error(`Falha ao buscar: ${resultado.error}`);
}
```

### 3. Encadeamento de Operações (Railway Programming)

```typescript
function validarIdade(idade: number): Result<number> {
  if (idade < 0) {
    return { success: false, error: "Idade não pode ser negativa" };
  }
  if (idade > 150) {
    return { success: false, error: "Idade inválida" };
  }
  return { success: true, data: idade };
}

function calcularAnoNascimento(idade: number): Result<number> {
  const anoAtual = new Date().getFullYear();
  return { success: true, data: anoAtual - idade };
}

function processarIdade(idadeInput: number): Result<number> {
  const validacao = validarIdade(idadeInput);
  if (!validacao.success) {
    return validacao; // Propaga erro
  }

  return calcularAnoNascimento(validacao.data);
}

// Uso
const resultado = processarIdade(-5);
if (resultado.success) {
  console.log(`Ano de nascimento: ${resultado.data}`);
} else {
  console.error(`Erro: ${resultado.error}`);
}
```

### 4. Helpers para Result

```typescript
// Helper para criar sucesso
function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

// Helper para criar erro
function err<T>(error: string): Result<T> {
  return { success: false, error };
}

// Helper para mapear Result
function map<T, U>(
  result: Result<T>,
  fn: (data: T) => U
): Result<U> {
  if (!result.success) {
    return { success: false, error: result.error };
  }
  return ok(fn(result.data!));
}

// Helper para flatMap (chain)
function flatMap<T, U>(
  result: Result<T>,
  fn: (data: T) => Result<U>
): Result<U> {
  if (!result.success) {
    return { success: false, error: result.error };
  }
  return fn(result.data!);
}

// Uso
const resultado = ok(10)
  .pipe(n => map(ok(n), x => x * 2))
  .pipe(n => flatMap(n, x => x > 15 ? ok(x) : err("Muito pequeno")));
```

### 5. Múltiplos Erros

```typescript
interface ResultMultipleErrors<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

function validarUsuario(dados: {
  nome: string;
  email: string;
  idade: number;
}): ResultMultipleErrors<{ nome: string; email: string; idade: number }> {
  const erros: string[] = [];

  if (!dados.nome || dados.nome.trim() === "") {
    erros.push("Nome é obrigatório");
  }

  if (!dados.email.includes("@")) {
    erros.push("Email inválido");
  }

  if (dados.idade < 18) {
    erros.push("Idade deve ser 18+");
  }

  if (erros.length > 0) {
    return { success: false, errors: erros };
  }

  return { success: true, data: dados };
}

const resultado = validarUsuario({
  nome: "",
  email: "invalido",
  idade: 16
});

if (!resultado.success) {
  console.log("Erros encontrados:");
  resultado.errors!.forEach(erro => console.log(`- ${erro}`));
}
```

## 🎯 Aplicabilidade

### Validação de Formulários

```typescript
interface FormResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface FormularioCadastro {
  nome: string;
  email: string;
  senha: string;
}

function validarFormulario(dados: FormularioCadastro): FormResult<FormularioCadastro> {
  if (dados.nome.length < 3) {
    return {
      success: false,
      error: "Nome deve ter pelo menos 3 caracteres"
    };
  }

  if (!dados.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return {
      success: false,
      error: "Email inválido"
    };
  }

  if (dados.senha.length < 8) {
    return {
      success: false,
      error: "Senha deve ter pelo menos 8 caracteres"
    };
  }

  return { success: true, data: dados };
}

// Uso
const resultado = validarFormulario({
  nome: "Ana",
  email: "ana@example.com",
  senha: "senha123"
});

if (resultado.success) {
  console.log("Formulário válido, enviando...");
  // enviar(resultado.data);
} else {
  console.error(`Validação falhou: ${resultado.error}`);
}
```

### CRUD com Result

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

class UsuarioService {
  private usuarios: Usuario[] = [];

  criar(dados: Omit<Usuario, "id">): Result<Usuario> {
    const existe = this.usuarios.find(u => u.email === dados.email);
    if (existe) {
      return {
        success: false,
        error: "Email já cadastrado"
      };
    }

    const usuario: Usuario = {
      id: this.usuarios.length + 1,
      ...dados
    };

    this.usuarios.push(usuario);

    return { success: true, data: usuario };
  }

  buscar(id: number): Result<Usuario> {
    const usuario = this.usuarios.find(u => u.id === id);

    if (!usuario) {
      return {
        success: false,
        error: `Usuário ${id} não encontrado`
      };
    }

    return { success: true, data: usuario };
  }

  atualizar(id: number, dados: Partial<Usuario>): Result<Usuario> {
    const resultado = this.buscar(id);
    if (!resultado.success) {
      return resultado;
    }

    const usuario = resultado.data;
    Object.assign(usuario, dados);

    return { success: true, data: usuario };
  }

  deletar(id: number): Result<void> {
    const index = this.usuarios.findIndex(u => u.id === id);

    if (index === -1) {
      return {
        success: false,
        error: `Usuário ${id} não encontrado`
      };
    }

    this.usuarios.splice(index, 1);

    return { success: true, data: undefined };
  }
}
```

### Parsing com Result

```typescript
function parseJSON<T>(json: string): Result<T> {
  try {
    const data = JSON.parse(json);
    return { success: true, data };
  } catch (erro) {
    return {
      success: false,
      error: `JSON inválido: ${erro instanceof Error ? erro.message : "Erro desconhecido"}`
    };
  }
}

function parseNumber(texto: string): Result<number> {
  const num = Number(texto);

  if (isNaN(num)) {
    return {
      success: false,
      error: `"${texto}" não é um número válido`
    };
  }

  return { success: true, data: num };
}

// Uso
const jsonResult = parseJSON<{ nome: string }>('{"nome": "Ana"}');
if (jsonResult.success) {
  console.log(jsonResult.data.nome);
}

const numResult = parseNumber("abc");
if (!numResult.success) {
  console.error(numResult.error);
}
```

## ⚠️ Considerações

### 1. Verbosidade

```typescript
// Mais verboso que try/catch
const r1 = operacao1();
if (!r1.success) return r1;

const r2 = operacao2(r1.data);
if (!r2.success) return { success: false, error: r2.error };

const r3 = operacao3(r2.data);
if (!r3.success) return { success: false, error: r3.error };

// vs

try {
  const v1 = operacao1Throw();
  const v2 = operacao2Throw(v1);
  const v3 = operacao3Throw(v2);
} catch (e) {
  // ...
}
```

### 2. Não Substitui Exceções Sempre

```typescript
// ✅ Use Result para: erros esperados, validações, operações que podem falhar
function validar(email: string): Result<string> { /* ... */ }

// ✅ Use exceções para: erros inesperados, bugs, situações excepcionais
function conectarBanco(): Connection {
  if (!driverDisponivel) {
    throw new Error("Driver de banco não disponível"); // Bug de configuração
  }
}
```

### 3. TypeScript Não Força Verificação

```typescript
function operacao(): Result<number> {
  return { success: true, data: 42 };
}

const resultado = operacao();
// ⚠️ TypeScript não força verificar 'success' antes de acessar 'data'
console.log(resultado.data); // Pode ser undefined se success = false
```

## 📚 Conclusão

Result Object Pattern encapsula sucesso ou falha em objeto estruturado, tratando erro como valor explícito no tipo de retorno. É ideal para erros esperados, validações, parsing e operações que podem falhar previsivelmente. Força tratamento explícito de erro, torna fluxo mais previsível e elimina overhead de exceções, sendo alternativa funcional ao try/catch tradicional.
