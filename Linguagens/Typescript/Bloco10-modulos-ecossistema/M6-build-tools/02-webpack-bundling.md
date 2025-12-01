# Webpack para Bundling: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Webpack** é **module bundler** que analisa dependências do projeto, processa assets (JS, CSS, imagens) através de loaders/plugins e gera bundles otimizados para produção. Com **TypeScript**, Webpack usa `ts-loader` ou `babel-loader` para transpilar código TS durante processo de bundling, unificando compilação e empacotamento em pipeline único. Conceitualmente, representa **dependency graph resolver**, transformando módulos interdependentes em poucos arquivos otimizados.

Na essência, Webpack materializa o princípio de **build-time optimization**, onde código de desenvolvimento (múltiplos arquivos, imports ES6, TypeScript) é transformado em código de produção (bundles minificados, code splitting, tree shaking), otimizado para carga rápida e performance em browsers.

## 📋 Fundamentos

### Instalação

```bash
# Webpack core + CLI
npm install --save-dev webpack webpack-cli

# TypeScript loader
npm install --save-dev ts-loader typescript

# Development server
npm install --save-dev webpack-dev-server

# Plugins comuns
npm install --save-dev html-webpack-plugin
```

### Estrutura Básica

```
projeto/
├── src/
│   ├── index.ts
│   └── utils/
│       └── math.ts
├── dist/               (gerado)
├── webpack.config.js
├── tsconfig.json
└── package.json
```

**Conceito-chave:** Webpack lê `webpack.config.js` para configurar build pipeline.

### Configuração Mínima

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  // Ponto de entrada
  entry: './src/index.ts',

  // Output
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  // Resolver extensões
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  // Loaders
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};
```

```json
// package.json
{
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development"
  }
}
```

## 🔍 Análise Conceitual

### 1. Entry e Output

```javascript
// webpack.config.js
module.exports = {
  // ENTRY: ponto inicial do grafo de dependências
  entry: './src/index.ts',

  // OUTPUT: onde e como gerar bundles
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true  // Limpa dist/ antes de build
  }
};
```

**Grafo de dependências:**
```
index.ts
  └─ imports utils/math.ts
      └─ imports lodash
          └─ imports lodash internals
```

**Webpack processa grafo inteiro e gera bundle único.**

### 2. Loaders - Transformações

```javascript
module.exports = {
  module: {
    rules: [
      // TypeScript
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },

      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

      // Imagens
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },

      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ]
  }
};
```

**Conceito:** Loaders **transformam** arquivos (TS → JS, SCSS → CSS, etc).

**Ordem de execução:**
```javascript
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
  // Executa: css-loader → style-loader (direita → esquerda)
}
```

### 3. ts-loader vs babel-loader

#### ts-loader (TypeScript oficial)

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: false  // Type checking habilitado
        }
      }
    ]
  }
};
```

**Vantagens:**
- Type checking durante build
- Usa tsconfig.json
- Integração perfeita com TypeScript

**Desvantagens:**
- Mais lento (type checking)

#### babel-loader + @babel/preset-typescript

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ]
  }
};
```

**Vantagens:**
- Muito mais rápido
- Plugins Babel disponíveis

**Desvantagens:**
- Sem type checking (precisa rodar `tsc --noEmit` separado)

### 4. Plugins

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    // Gera HTML automaticamente
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'My App'
    }),

    // Limpa dist/ antes de build
    new CleanWebpackPlugin()
  ]
};
```

**Conceito:** Plugins adicionam **funcionalidades** ao build (gerar HTML, minificar, etc).

### 5. Mode - Development vs Production

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    mode: argv.mode,

    // Diferentes configurações por mode
    devtool: isDev ? 'eval-source-map' : 'source-map',

    optimization: {
      minimize: !isDev
    }
  };
};
```

**Mode: development**
```bash
npm run dev
# - Não minifica
# - Source maps rápidos
# - Build rápido
```

**Mode: production**
```bash
npm run build
# - Minifica código
# - Tree shaking
# - Otimizações
```

### 6. Dev Server

```javascript
module.exports = {
  devServer: {
    static: './dist',
    port: 8080,
    hot: true,  // Hot Module Replacement
    open: true  // Abre browser automaticamente
  }
};
```

```json
{
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}
```

```bash
npm start
# Servidor em localhost:8080
# Hot reload ao salvar
```

**Conceito:** Dev server fornece **desenvolvimento local** com hot reload.

### 7. Code Splitting

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10
        },
        common: {
          minChunks: 2,
          priority: -20,
          name: 'common'
        }
      }
    }
  }
};
```

**Output:**
```
dist/
├── main.bundle.js       (código da aplicação)
├── vendors.bundle.js    (node_modules)
└── common.bundle.js     (código compartilhado)
```

**Conceito:** Code splitting divide bundle em **chunks menores** para carregar sob demanda.

### 8. Source Maps

```javascript
module.exports = {
  devtool: 'source-map'  // Produção
  // ou
  devtool: 'eval-source-map'  // Desenvolvimento (mais rápido)
};
```

**Tipos de source maps:**
```
eval                     - Mais rápido, sem arquivo .map
eval-source-map          - Rápido, qualidade boa (dev)
cheap-source-map         - Médio, sem colunas
source-map               - Lento, qualidade máxima (prod)
```

## 🎯 Aplicabilidade

### Configuração Completa TypeScript

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: './src/index.ts',

    output: {
      filename: isDev ? '[name].js' : '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ],

    devServer: {
      static: './dist',
      hot: true,
      port: 3000
    },

    devtool: isDev ? 'eval-source-map' : 'source-map',

    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  };
};
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node",

    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    },

    // Webpack faz emit, não tsc
    "noEmit": true
  }
}
```

### React + TypeScript

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.tsx',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        },
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};
```

**Dependências:**
```bash
npm install --save react react-dom
npm install --save-dev @types/react @types/react-dom
npm install --save-dev @babel/preset-react
```

### Multiple Entries

```javascript
module.exports = {
  entry: {
    main: './src/index.ts',
    admin: './src/admin.ts',
    vendor: './src/vendor.ts'
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

**Output:**
```
dist/
├── main.bundle.js
├── admin.bundle.js
└── vendor.bundle.js
```

### Environment Variables

```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify('https://api.example.com')
    })
  ]
};
```

```typescript
// src/config.ts
const API_URL = process.env.API_URL;
console.log(API_URL);  // "https://api.example.com"
```

### Otimizações de Produção

```javascript
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true  // Remove console.log
          }
        }
      }),
      new CssMinimizerPlugin()
    ],

    splitChunks: {
      chunks: 'all',
      maxSize: 200000  // 200kb
    }
  },

  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
```

## ⚠️ Considerações

### 1. Performance de Build

```javascript
// ❌ Lento
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'  // Type checking full
      }
    ]
  }
};

// ✅ Rápido
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true  // Sem type checking
          }
        }
      }
    ]
  }
};
```

**Rodar type checking separado:**
```json
{
  "scripts": {
    "build": "npm run typecheck && webpack",
    "typecheck": "tsc --noEmit"
  }
}
```

### 2. Bundle Size

```bash
# Analisar bundle
npm install --save-dev webpack-bundle-analyzer
```

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

### 3. Cache

```javascript
module.exports = {
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.webpack-cache')
  }
};
```

### 4. Webpack vs Vite

**Webpack:**
- Maduro, estável
- Ecossistema enorme
- Configuração complexa
- Build mais lento

**Vite:**
- Moderno, rápido
- Zero-config
- Build muito mais rápido
- Menos plugins

## 📚 Conclusão

Webpack é **module bundler** que transforma múltiplos arquivos em bundles otimizados. Entry define ponto inicial, output destino. Loaders transformam arquivos (ts-loader para TypeScript). Plugins adicionam funcionalidades (HtmlWebpackPlugin, CleanWebpackPlugin). Mode: development (rápido) vs production (otimizado). Dev server com hot reload. Code splitting divide bundles. Source maps para debug. ts-loader (type checking) vs babel-loader (rápido). Configurar resolve.extensions para .ts/.tsx. splitChunks separa vendors. DefinePlugin para env vars. Análise de bundle com BundleAnalyzerPlugin. Cache de filesystem acelera builds. Alternativas modernas: Vite, esbuild.

