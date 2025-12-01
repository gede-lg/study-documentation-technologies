# 🎯 Introdução

File upload representa desafio fundamental em aplicações web modernas: transferir dados binários de tamanho arbitrário do cliente para servidor de forma eficiente, confiável, e com feedback adequado ao usuário. Diferente de JSON payloads típicos, arquivos introduzem complexidades: encoding binário, tamanhos potencialmente enormes (gigabytes), necessidade de progress tracking, e formato multipart/form-data específico para HTTP.

O problema que file upload resolve é permitir usuários compartilharem conteúdo rico: fotos em redes sociais, documentos em sistemas corporativos, avatars em perfis, vídeos em plataformas de streaming, arquivos CSV para import de dados. Cada use case tem requisitos únicos: uploads de avatars requerem validação de formato e dimensões, uploads de vídeos precisam de chunks e resumability, imports de CSV necessitam validação e preview antes de processar.

Axios simplifica file uploads através de suporte nativo para **FormData API**, abstração browser para construir multipart/form-data requests. FormData permite anexar arquivos obtidos de `<input type="file">` ou criados programaticamente via Blob API, misturar arquivos com campos de texto, e até enviar múltiplos arquivos em single request. Axios automaticamente detecta FormData e configura Content-Type apropriado (`multipart/form-data` com boundary).

Entretanto, implementações production-ready de file upload vão além de básico `axios.post(url, formData)`: validação client-side de tipo e tamanho antes de upload (economizar bandwidth), progress tracking para UX (barra de progresso), error handling para uploads falhados (network interruption, server validation errors), e retry logic para resiliência. Para arquivos grandes, chunking (dividir arquivo em partes) e resumable uploads tornam-se necessários.

Este módulo explora file upload com Axios em profundidade: desde conceitos fundamentais de FormData e multipart/form-data, através de implementações práticas de single e multiple file uploads, até patterns avançados de validação, error handling, e integração com bibliotecas de UI (drag-and-drop). Objetivo é equipar você para implementar upload experiences robustas e user-friendly.

---

# 📋 Sumário

### **Fundamentos de File Upload**
- Problema resolvido por file uploads
- FormData API
- multipart/form-data encoding
- Content-Type e boundary

### **Basic File Upload com Axios**
- Obtendo arquivo de input element
- Criando FormData
- Enviando com axios.post
- Configurando headers

### **Multiple File Upload**
- Múltiplos arquivos em single request
- FormData.append() múltiplas vezes
- Array de arquivos no input

### **Validação Client-Side**
- Validação de tipo de arquivo (MIME type)
- Validação de tamanho (file size limits)
- Validação de dimensões (imagens)
- Preview antes de upload

### **Mixing Files e Text Fields**
- Enviando arquivo + metadata
- FormData com campos de texto
- JSON + arquivo em mesmo request

### **Error Handling**
- Upload timeout configuration
- Network errors durante upload
- Server validation errors (422)
- Retry logic para uploads falhados

### **Integration com File Input**
- Handling de `<input type="file">`
- onChange event
- File object properties
- Clearing input após upload

### **Best Practices**
- Client-side validation
- File size limits
- Supported formats
- Security considerations (file type spoofing)

---

# 🧠 Fundamentos

## Problema Resolvido por File Upload

**Transferência de Dados Binários**: HTTP originalmente projetado para texto (HTML, JSON, XML). Arquivos binários (imagens, vídeos, PDFs) requerem encoding especial.

**Tamanho Arbitrário**: JSON payloads típicos são kilobytes. Arquivos podem ser megabytes ou gigabytes, requerendo streaming e chunking.

**Metadata + File**: Frequentemente necessário enviar arquivo junto com informações adicionais (descrição, tags, author), requerendo formato que suporte múltiplos campos.

**User Feedback**: Uploads demorados necessitam progress tracking para evitar que usuários pensem que app está travado.

## FormData API

**FormData** é browser API para construir dados no formato `multipart/form-data`:

```javascript
const formData = new FormData();

// Adicionar campo de texto
formData.append('username', 'john_doe');

// Adicionar arquivo
const fileInput = document.querySelector('#file-input');
const file = fileInput.files[0];
formData.append('avatar', file);

// Adicionar múltiplos valores para mesma key
formData.append('tags', 'javascript');
formData.append('tags', 'tutorial');
```

**Métodos FormData**:
- `append(key, value)`: Adiciona campo
- `set(key, value)`: Substitui campo existente
- `delete(key)`: Remove campo
- `get(key)`: Obtém valor
- `has(key)`: Verifica existência
- `entries()`: Iterador de [key, value]

**File Object**: Obtido de `<input type="file">`, contém:
- `name`: Nome do arquivo
- `size`: Tamanho em bytes
- `type`: MIME type (ex: 'image/png')
- `lastModified`: Timestamp

## multipart/form-data Encoding

Quando enviamos FormData, HTTP request é codificado como `multipart/form-data`:

**Request**:
```http
POST /upload HTTP/1.1
Host: api.example.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="username"

john_doe
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="avatar"; filename="photo.jpg"
Content-Type: image/jpeg

[binary data here]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Componentes**:
- **boundary**: String única separando partes (gerada automaticamente)
- **Content-Disposition**: Header de cada parte indicando nome do campo
- **filename**: Nome do arquivo (apenas para file fields)
- **Content-Type**: MIME type do arquivo

**Axios Handling**: Axios detecta FormData automaticamente e configura `Content-Type` com boundary. Você NÃO deve setar Content-Type manualmente:

```javascript
// ❌ ERRADO
axios.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data' // Falta boundary!
  }
});

// ✅ CORRETO
axios.post('/upload', formData); // Axios configura automaticamente
```

---

# 🔍 Análise

## Basic File Upload com Axios

### **HTML**

```html
<form id="upload-form">
  <input type="file" id="file-input" accept="image/*">
  <button type="submit">Upload</button>
</form>
```

### **JavaScript**

```javascript
import axios from 'axios';

const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Obter arquivo do input
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a file');
    return;
  }
  
  // Criar FormData
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post('https://api.example.com/upload', formData);
    console.log('Upload successful:', response.data);
    alert(`File uploaded: ${response.data.url}`);
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Upload failed');
  }
});
```

**Server Response** (exemplo):
```json
{
  "success": true,
  "url": "https://cdn.example.com/uploads/abc123.jpg",
  "filename": "photo.jpg",
  "size": 245678
}
```

### **Com Custom Filename**

```javascript
// Renomear arquivo antes de upload
const file = fileInput.files[0];
const newFile = new File([file], 'custom-name.jpg', { type: file.type });

const formData = new FormData();
formData.append('file', newFile);

await axios.post('/upload', formData);
```

## Multiple File Upload

### **HTML**

```html
<input type="file" id="file-input" multiple accept="image/*">
```

### **JavaScript**

```javascript
const fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', async () => {
  const files = fileInput.files; // FileList
  
  if (files.length === 0) {
    return;
  }
  
  const formData = new FormData();
  
  // Adicionar todos os arquivos
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]); // Mesma key 'files' para todos
  }
  
  try {
    const response = await axios.post('https://api.example.com/upload-multiple', formData);
    console.log('Uploaded files:', response.data.urls);
  } catch (error) {
    console.error('Upload failed:', error);
  }
});
```

**Server recebe** array de arquivos associado à key `files`.

**Alternative Pattern**: Keys únicas para cada arquivo

```javascript
for (let i = 0; i < files.length; i++) {
  formData.append(`file${i}`, files[i]);
}
// Server recebe: file0, file1, file2, etc.
```

## Validação Client-Side

### **Validação de Tipo**

```javascript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function validateFileType(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(', ')}`);
  }
}

// Uso
const file = fileInput.files[0];
try {
  validateFileType(file);
  // Prosseguir com upload
} catch (error) {
  alert(error.message);
}
```

**Note**: `file.type` pode ser spoofed. Validação server-side é essencial.

### **Validação de Tamanho**

```javascript
const MAX_SIZE = 5 * 1024 * 1024; // 5MB em bytes

function validateFileSize(file) {
  if (file.size > MAX_SIZE) {
    throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: 5MB`);
  }
}

// Uso
const file = fileInput.files[0];
try {
  validateFileSize(file);
  // Prosseguir com upload
} catch (error) {
  alert(error.message);
}
```

### **Validação de Dimensões (Imagens)**

```javascript
function validateImageDimensions(file, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url); // Limpar memória
      
      if (img.width > maxWidth || img.height > maxHeight) {
        reject(new Error(`Image too large: ${img.width}x${img.height}px. Max: ${maxWidth}x${maxHeight}px`));
      } else {
        resolve();
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

// Uso
const file = fileInput.files[0];
try {
  await validateImageDimensions(file, 1920, 1080);
  // Prosseguir com upload
} catch (error) {
  alert(error.message);
}
```

### **Preview Antes de Upload**

```javascript
function previewImage(file) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const img = document.createElement('img');
    img.src = e.target.result; // Data URL
    img.style.maxWidth = '200px';
    
    const preview = document.getElementById('preview');
    preview.innerHTML = '';
    preview.appendChild(img);
  };
  
  reader.readAsDataURL(file);
}

// Uso
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file && file.type.startsWith('image/')) {
    previewImage(file);
  }
});
```

## Mixing Files e Text Fields

Frequentemente precisamos enviar arquivo junto com metadata:

```javascript
const formData = new FormData();

// File
const file = fileInput.files[0];
formData.append('file', file);

// Text fields
formData.append('title', 'My Photo');
formData.append('description', 'A beautiful landscape');
formData.append('tags', JSON.stringify(['nature', 'landscape']));

// Number
formData.append('category_id', 5);

await axios.post('/upload', formData);
```

**Server recebe**:
```
file: [binary data]
title: "My Photo"
description: "A beautiful landscape"
tags: "[\"nature\",\"landscape\"]"
category_id: "5"
```

**Note**: Todos os valores em FormData são strings (exceto File/Blob). Server deve fazer parsing/conversion.

### **Alternative: JSON + File Separado**

Algumas APIs preferem JSON separado de arquivo:

```javascript
// Opção 1: JSON como string em FormData
const formData = new FormData();
formData.append('file', file);
formData.append('metadata', JSON.stringify({
  title: 'My Photo',
  description: 'A beautiful landscape',
  tags: ['nature', 'landscape']
}));

await axios.post('/upload', formData);
```

```javascript
// Opção 2: Two requests
// 1. Upload file
const uploadResponse = await axios.post('/upload', formData);
const fileUrl = uploadResponse.data.url;

// 2. Create record com URL
await axios.post('/photos', {
  title: 'My Photo',
  description: 'A beautiful landscape',
  file_url: fileUrl,
  tags: ['nature', 'landscape']
});
```

## Error Handling

### **Timeout para Uploads Longos**

```javascript
const formData = new FormData();
formData.append('file', largeFile);

await axios.post('/upload', formData, {
  timeout: 60000 // 60 segundos (default é 0 = sem timeout)
});
```

**Cuidado**: Arquivos grandes podem levar minutos. Ajustar timeout conforme necessário ou usar 0 (sem timeout).

### **Network Errors**

```javascript
try {
  await axios.post('/upload', formData);
} catch (error) {
  if (error.code === 'ECONNABORTED') {
    alert('Upload timed out. Please try again.');
  } else if (error.code === 'ERR_NETWORK') {
    alert('Network error. Check your connection.');
  } else if (error.response) {
    // Server respondeu com error status
    console.error('Server error:', error.response.data);
    alert(`Upload failed: ${error.response.data.message}`);
  } else {
    alert('Upload failed. Please try again.');
  }
}
```

### **Server Validation Errors (422)**

```javascript
try {
  await axios.post('/upload', formData);
} catch (error) {
  if (error.response?.status === 422) {
    // Unprocessable Entity - validation errors
    const errors = error.response.data.errors;
    
    if (errors.file) {
      alert(`File validation error: ${errors.file.join(', ')}`);
    }
    
    // Exemplo de errors object:
    // {
    //   "errors": {
    //     "file": ["File type not allowed", "File too large"]
    //   }
    // }
  }
}
```

### **Retry Logic**

```javascript
async function uploadWithRetry(formData, maxRetries = 3) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await axios.post('/upload', formData, {
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      attempt++;
      
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        if (attempt >= maxRetries) {
          throw new Error(`Upload failed after ${maxRetries} attempts`);
        }
        
        console.log(`Upload attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      } else {
        // Outro tipo de error (validation, server error), não retry
        throw error;
      }
    }
  }
}

// Uso
try {
  const result = await uploadWithRetry(formData);
  console.log('Upload successful:', result);
} catch (error) {
  console.error('Upload failed:', error);
}
```

## Integration com File Input

### **Basic Integration**

```javascript
const fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  
  if (!file) return;
  
  // Validações
  try {
    validateFileType(file);
    validateFileSize(file);
  } catch (error) {
    alert(error.message);
    fileInput.value = ''; // Limpar input
    return;
  }
  
  // Upload
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post('/upload', formData);
    console.log('Uploaded:', response.data.url);
    
    // Limpar input após sucesso
    fileInput.value = '';
  } catch (error) {
    console.error('Upload failed:', error);
  }
});
```

### **File Object Properties**

```javascript
const file = fileInput.files[0];

console.log('Name:', file.name); // "photo.jpg"
console.log('Size:', file.size); // 245678 bytes
console.log('Type:', file.type); // "image/jpeg"
console.log('Last Modified:', new Date(file.lastModified)); // Date object
```

### **Clearing Input**

```javascript
// Limpar input (permite re-selecionar mesmo arquivo)
fileInput.value = '';

// Ou via DOM
fileInput.files = new DataTransfer().files;
```

### **Programmatic File Creation**

```javascript
// Criar arquivo programaticamente (ex: canvas export)
const canvas = document.getElementById('canvas');
canvas.toBlob((blob) => {
  const file = new File([blob], 'drawing.png', { type: 'image/png' });
  
  const formData = new FormData();
  formData.append('file', file);
  
  axios.post('/upload', formData);
}, 'image/png');
```

## Best Practices

### **1. Comprehensive Validation**

```javascript
async function validateFile(file) {
  // Type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  // Size
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
  
  // Dimensions (apenas para imagens)
  if (file.type.startsWith('image/')) {
    await validateImageDimensions(file, 2000, 2000);
  }
}
```

### **2. User Feedback**

```javascript
const uploadButton = document.getElementById('upload-btn');

uploadButton.addEventListener('click', async () => {
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a file');
    return;
  }
  
  // Disable button durante upload
  uploadButton.disabled = true;
  uploadButton.textContent = 'Uploading...';
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('/upload', formData);
    alert('Upload successful!');
  } catch (error) {
    alert('Upload failed');
  } finally {
    // Re-enable button
    uploadButton.disabled = false;
    uploadButton.textContent = 'Upload';
  }
});
```

### **3. Security Considerations**

**MIME Type Spoofing**:
```javascript
// ❌ NÃO confiar apenas em file.type
// Atacante pode renomear virus.exe para photo.jpg

// ✅ Validação client-side + server-side
// Server deve validar magic bytes, não apenas extension
```

**File Size Limits**:
```javascript
// Prevenir DoS via uploads enormes
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
if (file.size > MAX_SIZE) {
  throw new Error('File too large');
}
```

**Sanitização de Filename**:
```javascript
// Server deve sanitizar filename (remover path traversal)
// Exemplo: "../../etc/passwd" → "passwd"
```

### **4. Informative Errors**

```javascript
try {
  await axios.post('/upload', formData);
} catch (error) {
  let message = 'Upload failed';
  
  if (error.response?.status === 413) {
    message = 'File too large for server';
  } else if (error.response?.status === 415) {
    message = 'File type not supported';
  } else if (error.response?.status === 422) {
    message = error.response.data.message || 'Validation error';
  } else if (error.code === 'ECONNABORTED') {
    message = 'Upload timed out';
  } else if (error.code === 'ERR_NETWORK') {
    message = 'Network error';
  }
  
  alert(message);
}
```

---

# 🎯 Aplicabilidade

## Quando Usar File Upload

**User-Generated Content**: Redes sociais, forums, blogs.

**Document Management**: Upload de contracts, invoices, reports.

**Media Platforms**: Upload de fotos, vídeos, áudio.

**Data Import**: Upload de CSV, Excel para import de dados.

**Profile Pictures**: Avatar upload em aplicações.

## Quando Considerar Alternativas

**Small Files Embedded**: Para files muito pequenos (ícones), considerar data URLs em JSON.

**Real-Time Data**: Para streaming de vídeo/áudio em tempo real, usar WebRTC ou WebSockets.

---

# ⚠️ Limitações

## Tamanho de Arquivo

Browsers e servers têm limites de tamanho. Para arquivos > 100MB, considerar chunked upload ou resumable upload protocols.

## Timeout Issues

Uploads grandes podem exceder timeouts de proxy/load balancer. Configurar timeouts adequadamente.

## Memory Usage

FormData carrega arquivo inteiro em memória. Para arquivos muito grandes, pode causar issues em devices com pouca RAM.

## Progress Tracking Precision

Progress tracking (próximo módulo) pode não ser preciso se server faz processing após receber arquivo.

---

# 🔗 Interconexões

## Requires FormData API

Browser API para construir multipart/form-data.

## Enables Progress Tracking

Upload progress (próximo tópico) requer file upload como base.

## Complements Authentication

Uploads geralmente requerem autenticação (Bearer Token, OAuth).

---

# 🚀 Evolução

## Resumable Uploads

Protocols como tus.io permitem retomar uploads interrompidos.

## Direct-to-Cloud Uploads

Upload direto para S3/Azure Blob Storage via signed URLs, eliminando servidor intermediário.

## Chunked Upload

Dividir arquivo em chunks e enviar separadamente para files muito grandes.

## WebAssembly Processing

Client-side compression/resizing antes de upload usando WASM.

---

**Conclusão Integrada**: File upload com Axios é streamlined via suporte nativo para FormData e detecção automática de multipart/form-data encoding. Implementações robustas requerem validação comprehensive (tipo, tamanho, dimensões), error handling para timeouts e network issues, e retry logic para resiliência. Best practices incluem feedback visual ao usuário, security considerations (validação server-side essencial), e informative error messages. Próximo tópico explorará download de arquivos e progress tracking, complementando upload/download cycle.