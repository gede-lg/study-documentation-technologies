# Intl API: Fundamentos de Internacionalização

## 🎯 Definição

**Intl API** (Internationalization API) fornece funcionalidades para formatação sensível a localização (locale) de datas, números, moedas, unidades e strings. Permite criar aplicações que se adaptam automaticamente a diferentes idiomas, regiões e convenções culturais sem código customizado para cada locale.

```javascript
// Formatação de número em diferentes locales
const numero = 1234567.89;

console.log(new Intl.NumberFormat('pt-BR').format(numero));
// '1.234.567,89'

console.log(new Intl.NumberFormat('en-US').format(numero));
// '1,234,567.89'

console.log(new Intl.NumberFormat('de-DE').format(numero));
// '1.234.567,89'
```

**Conceito:** API nativa para internacionalização e formatação locale-aware.

## 📋 Principais Classes

### Intl.NumberFormat

Formata números, moedas e porcentagens:

```javascript
// Números básicos
const formatter = new Intl.NumberFormat('pt-BR');
console.log(formatter.format(1234.56)); // '1.234,56'

// Moeda
const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});
console.log(moeda.format(1234.56)); // 'R$ 1.234,56'

// Porcentagem
const porcento = new Intl.NumberFormat('pt-BR', {
  style: 'percent'
});
console.log(porcento.format(0.75)); // '75%'

// Unidades
const unidade = new Intl.NumberFormat('pt-BR', {
  style: 'unit',
  unit: 'kilometer-per-hour'
});
console.log(unidade.format(120)); // '120 km/h'
```

### Intl.DateTimeFormat

Formata datas e horas:

```javascript
const data = new Date('2025-01-13T15:30:00');

// Data completa
const formatador = new Intl.DateTimeFormat('pt-BR');
console.log(formatador.format(data)); // '13/01/2025'

// Data e hora
const dataHora = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short'
});
console.log(dataHora.format(data)); // '13/01/2025 15:30'

// Data por extenso
const extenso = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
console.log(extenso.format(data));
// 'segunda-feira, 13 de janeiro de 2025'

// Hora detalhada
const hora = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});
console.log(hora.format(data)); // '15:30:00'
```

### Intl.RelativeTimeFormat

Formata tempo relativo ("há 2 dias", "em 3 horas"):

```javascript
const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

console.log(rtf.format(-1, 'day'));     // 'ontem'
console.log(rtf.format(0, 'day'));      // 'hoje'
console.log(rtf.format(1, 'day'));      // 'amanhã'
console.log(rtf.format(2, 'day'));      // 'em 2 dias'
console.log(rtf.format(-3, 'week'));    // 'há 3 semanas'
console.log(rtf.format(5, 'month'));    // 'em 5 meses'

// Comparar com numeric: 'always'
const rtf2 = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'always' });
console.log(rtf2.format(-1, 'day'));    // 'há 1 dia' (não 'ontem')
```

### Intl.ListFormat

Formata listas de strings:

```javascript
const lista = ['maçã', 'banana', 'laranja'];

// Conjunção (e)
const e = new Intl.ListFormat('pt-BR', { type: 'conjunction' });
console.log(e.format(lista)); // 'maçã, banana e laranja'

// Disjunção (ou)
const ou = new Intl.ListFormat('pt-BR', { type: 'disjunction' });
console.log(ou.format(lista)); // 'maçã, banana ou laranja'

// Lista simples
const lista2 = new Intl.ListFormat('pt-BR', { type: 'unit' });
console.log(lista2.format(lista)); // 'maçã, banana, laranja'
```

### Intl.PluralRules

Determina regras de plural para locale:

```javascript
const pr = new Intl.PluralRules('pt-BR');

function formatarMensagem(n) {
  const regra = pr.select(n);
  const mapa = {
    one: `${n} item`,
    other: `${n} itens`
  };
  return mapa[regra];
}

console.log(formatarMensagem(0));  // '0 itens'
console.log(formatarMensagem(1));  // '1 item'
console.log(formatarMensagem(5));  // '5 itens'

// Outros locales têm regras diferentes
const prAr = new Intl.PluralRules('ar-EG');
// Árabe tem 6 formas plurais: zero, one, two, few, many, other
```

### Intl.Collator

Compara strings de acordo com regras locale-específicas:

```javascript
// Ordenação simples (incorreta para alguns idiomas)
const nomes = ['Émile', 'André', 'Zoé', 'Anne'];
console.log(nomes.sort());
// Pode dar resultado incorreto dependendo do locale

// Ordenação correta com Collator
const collator = new Intl.Collator('fr-FR');
console.log(nomes.sort(collator.compare));
// ['André', 'Anne', 'Émile', 'Zoé']

// Ignorar acentos
const semAcentos = new Intl.Collator('pt-BR', { sensitivity: 'base' });
console.log(semAcentos.compare('café', 'cafe')); // 0 (iguais)

// Ordenação numérica
const numerico = new Intl.Collator('pt-BR', { numeric: true });
const items = ['item 2', 'item 10', 'item 1'];
console.log(items.sort(numerico.compare));
// ['item 1', 'item 2', 'item 10'] (correto)
// Sem numeric: ['item 1', 'item 10', 'item 2'] (lexicográfico)
```

## 🧠 Opções de Formatação

### NumberFormat: Casas Decimais

```javascript
const numero = 1234.5678;

// Mínimo/máximo de casas decimais
const fmt = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4
});

console.log(fmt.format(1234.5));     // '1.234,50'
console.log(fmt.format(1234.5678));  // '1.234,5678'
console.log(fmt.format(1234.56789)); // '1.234,5679' (arredondado)
```

### NumberFormat: Agrupamento

```javascript
// Desabilitar agrupamento de milhares
const semGrupo = new Intl.NumberFormat('pt-BR', {
  useGrouping: false
});
console.log(semGrupo.format(1234567)); // '1234567'

// Com agrupamento (padrão)
const comGrupo = new Intl.NumberFormat('pt-BR');
console.log(comGrupo.format(1234567)); // '1.234.567'
```

### DateTimeFormat: Time Zones

```javascript
const data = new Date('2025-01-13T15:30:00Z');

// UTC
const utc = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'UTC',
  timeZoneName: 'short',
  hour: '2-digit',
  minute: '2-digit'
});
console.log(utc.format(data)); // '15:30 UTC'

// São Paulo
const sp = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  timeZoneName: 'short',
  hour: '2-digit',
  minute: '2-digit'
});
console.log(sp.format(data)); // '12:30 GMT-3'

// Tokyo
const tokyo = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'Asia/Tokyo',
  timeZoneName: 'short',
  hour: '2-digit',
  minute: '2-digit'
});
console.log(tokyo.format(data)); // '00:30 GMT+9'
```

## 🔍 Casos Práticos

### Formatador de Moeda Reutilizável

```javascript
class FormatadorMoeda {
  constructor(locale = 'pt-BR', moeda = 'BRL') {
    this.formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: moeda
    });
  }

  formatar(valor) {
    return this.formatter.format(valor);
  }
}

const real = new FormatadorMoeda('pt-BR', 'BRL');
const dolar = new FormatadorMoeda('en-US', 'USD');
const euro = new FormatadorMoeda('de-DE', 'EUR');

console.log(real.formatar(1234.56));   // 'R$ 1.234,56'
console.log(dolar.formatar(1234.56));  // '$1,234.56'
console.log(euro.formatar(1234.56));   // '1.234,56 €'
```

### Data Relativa (Helper)

```javascript
function formatarDataRelativa(data, locale = 'pt-BR') {
  const agora = new Date();
  const diff = data - agora;
  const segundos = Math.floor(diff / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const meses = Math.floor(dias / 30);
  const anos = Math.floor(dias / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(anos) > 0) return rtf.format(anos, 'year');
  if (Math.abs(meses) > 0) return rtf.format(meses, 'month');
  if (Math.abs(dias) > 0) return rtf.format(dias, 'day');
  if (Math.abs(horas) > 0) return rtf.format(horas, 'hour');
  if (Math.abs(minutos) > 0) return rtf.format(minutos, 'minute');
  return rtf.format(segundos, 'second');
}

const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000);
console.log(formatarDataRelativa(amanha)); // 'amanhã'

const ontem = new Date(Date.now() - 24 * 60 * 60 * 1000);
console.log(formatarDataRelativa(ontem)); // 'ontem'
```

### Ordenação de Strings Localizada

```javascript
function ordenarLocalizado(array, locale = 'pt-BR') {
  const collator = new Intl.Collator(locale);
  return [...array].sort(collator.compare);
}

const nomes = ['Zélia', 'André', 'Ágata', 'Carlos'];
console.log(ordenarLocalizado(nomes));
// ['Ágata', 'André', 'Carlos', 'Zélia']
```

### Plural Dinâmico

```javascript
function formatarContagem(n, singular, plural, locale = 'pt-BR') {
  const pr = new Intl.PluralRules(locale);
  const regra = pr.select(n);

  const forma = regra === 'one' ? singular : plural;
  return `${n} ${forma}`;
}

console.log(formatarContagem(0, 'arquivo', 'arquivos'));   // '0 arquivos'
console.log(formatarContagem(1, 'arquivo', 'arquivos'));   // '1 arquivo'
console.log(formatarContagem(10, 'arquivo', 'arquivos'));  // '10 arquivos'
```

### Range de Datas

```javascript
// Intl.DateTimeFormat.formatRange (ES2021+)
const inicio = new Date('2025-01-10');
const fim = new Date('2025-01-13');

const formatter = new Intl.DateTimeFormat('pt-BR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Range
if (formatter.formatRange) {
  console.log(formatter.formatRange(inicio, fim));
  // '10 a 13 de janeiro de 2025'
}
```

## ⚠️ Considerações

### Suporte a Locales

```javascript
// Verificar locales suportados
const localesSuportados = Intl.NumberFormat.supportedLocalesOf([
  'pt-BR', 'en-US', 'ja-JP', 'locale-invalido'
]);

console.log(localesSuportados);
// ['pt-BR', 'en-US', 'ja-JP'] (locale-invalido omitido)
```

### Fallback de Locale

```javascript
// Se locale não é suportado, usa fallback
const fmt = new Intl.NumberFormat('pt-BR-inexistente');

// Resolução de locale
console.log(fmt.resolvedOptions().locale);
// Pode retornar 'pt-BR' ou 'pt' (mais genérico)
```

### Performance com Reutilização

```javascript
// ❌ Criar formatter a cada chamada (lento)
function formatar(numero) {
  return new Intl.NumberFormat('pt-BR').format(numero);
}

// ✅ Reutilizar formatter (rápido)
const formatter = new Intl.NumberFormat('pt-BR');

function formatar(numero) {
  return formatter.format(numero);
}

// Ou cachear
const formatters = new Map();

function getFormatter(locale) {
  if (!formatters.has(locale)) {
    formatters.set(locale, new Intl.NumberFormat(locale));
  }
  return formatters.get(locale);
}
```

## 🚀 Integração com Frameworks

### React

```javascript
function Preco({ valor, locale = 'pt-BR', moeda = 'BRL' }) {
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: moeda
    }),
    [locale, moeda]
  );

  return <span>{formatter.format(valor)}</span>;
}
```

### Detectar Locale do Navegador

```javascript
// Browser: navigator.languages
const localeUsuario = navigator.languages[0] || navigator.language || 'en-US';

const formatter = new Intl.NumberFormat(localeUsuario);
console.log(formatter.format(1234.56));
// Formatado de acordo com preferência do usuário
```

### Node.js: Locale do Sistema

```javascript
// Node.js: process.env ou bibliotecas como os-locale
const locale = process.env.LANG?.split('.')[0].replace('_', '-') || 'en-US';

const formatter = new Intl.NumberFormat(locale);
console.log(formatter.format(1234.56));
```

Intl API elimina necessidade de bibliotecas externas para internacionalização básica, oferecendo suporte nativo robusto para formatação sensível a locale em JavaScript moderno.
