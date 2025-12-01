# 🎯 Introdução

Multipart/form-data representa encoding fundamental para transmission de dados complexos via HTTP: formato que permite combinar arquivos binários, texto, e metadata em single request, resolvendo limitação histórica de forms HTML que só podiam enviar text fields. Este encoding torna-se essencial quando aplicação precisa enviar arquivo junto com informações contextuais: upload de avatar com user ID, submissão de documento com title e description, ou batch upload de imagens com tags por arquivo.

O problema que multipart/form-data resolve é **heterogeneity de dados**: application/json só pode carregar JSON (texto), application/octet-stream só pode carregar binário puro, e application/x-www-form-urlencoded não suporta arquivos. Multipart/form-data permite misturar tudo: strings, numbers, JSON, arquivos, arrays, em single HTTP request, cada parte com seu próprio Content-Type.

Axios abstrai complexidade de multipart/form-data através de **automatic detection de FormData objects**: quando você passa FormData como body de request, Axios automaticamente configura `Content-Type: multipart/form-data` com boundary único, serializa cada campo apropriadamente, e envia request. Developer não precisa manualmente construir multipart encoding - apenas popular FormData e Axios handle resto.

Entretanto, compreensão profunda de multipart/form-data é crítica para debugging e otimização: boundary é delimiter entre partes (gerado aleatoriamente), cada parte tem headers (Content-Disposition, Content-Type), e servidor deve parsear multipart data (via libraries como multer em Node.js, MultipartFile em Spring Boot). Edge cases incluem: escaping de filenames com caracteres especiais, UTF-8 encoding de non-ASCII characters, e size limits de requests.

Este módulo explora multipart/form-data em profundidade: desde especificação HTTP e estrutura de encoding, através de uso prático com Axios e FormData API, até patterns avançados de nested structures, array handling, e integration com diferentes backend frameworks. Objetivo é fornecer compreensão completa de multipart encoding para implementar file uploads robustos e debugar issues efetivamente.

---

# 📋 Sumário

### **Fundamentos de Multipart/Form-Data**
- Problema resolvido por multipart
- RFC 7578 specification
- Boundary concept
- Structure de multipart message

### **FormData API**
- Criando FormData instances
- append(), set(), delete()
- Iterating over FormData
- Browser compatibility

### **Basic Multipart com Axios**
- Enviando FormData
- Automatic Content-Type configuration
- Boundary generation
- Inspecting multipart requests

### **Mixing Data Types**
- Files + text fields
- JSON + files
- Arrays em FormData
- Nested objects

### **Content-Disposition Header**
- form-data disposition type
- name parameter
- filename parameter
- Escaping special characters

### **Backend Integration**
- Node.js (multer)
- Spring Boot (MultipartFile)
- Python (Flask, FastAPI)
- PHP ($_FILES)

### **Advanced Patterns**
- Multiple files com mesmo field name
- Dynamic field names
- File metadata em FormData
- FormData serialization

### **Best Practices**
- Field naming conventions
- Type conversion (server-side)
- Size limits
- Security considerations

---

# 🧠 Fundamentos

## Problema Resolvido por Multipart

**Scenario**: Form HTML com file input e text fields:

```html
<form enctype="multipart/form-data">
  <input type="text" name="title" value="My Photo">
  <input type="text" name="description" value="Beautiful sunset">
  <input type="file" name="photo">
  <button type="submit">Upload</button>
</form>
```

**Sem Multipart**: Não há encoding padrão que suporte texto + arquivo simultaneamente.

**Com Multipart**: Single request contém todos os dados, cada parte com encoding apropriado.

## RFC 7578 Specification

Multipart/form-data é definido na RFC 7578.

**Características**:
- Cada parte é separada por **boundary** (delimiter único)
- Cada parte tem headers (Content-Disposition, Content-Type)
- Partes podem ter tipos diferentes (texto, binário, JSON)

## Boundary Concept

**Boundary**: String única que delimita partes do request.

**Formato**:
```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
```

**Requirement**: Boundary NÃO pode aparecer no conteúdo de nenhuma parte. Gerado aleatoriamente para garantir unicidade.

**Exemplo de Boundary**:
```
----WebKitFormBoundary7MA4YWxkTrZu0gW
----WebKitFormBoundaryABCDEFGH12345678
-----------------------------9051914041544843365972754266
```

## Structure de Multipart Message

**Exemplo Completo**:

```http
POST /upload HTTP/1.1
Host: api.example.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Length: 1234

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="title"

My Photo
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="description"

Beautiful sunset
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="photo"; filename="sunset.jpg"
Content-Type: image/jpeg

[binary JPEG data here]
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

**Components**:
1. **Request headers**: Content-Type com boundary
2. **First boundary**: `--{boundary}`
3. **Part 1** (text field):
   - `Content-Disposition: form-data; name="title"`
   - Blank line
   - Value: `My Photo`
4. **Boundary**: `--{boundary}`
5. **Part 2** (text field): Similar a Part 1
6. **Boundary**: `--{boundary}`
7. **Part 3** (file):
   - `Content-Disposition: form-data; name="photo"; filename="sunset.jpg"`
   - `Content-Type: image/jpeg`
   - Blank line
   - Binary data
8. **Closing boundary**: `--{boundary}--` (note extra `--` no final)

---

# 🔍 Análise

## FormData API

### **Criando FormData**

```javascript
// Empty FormData
const formData = new FormData();

// De form existente
const form = document.getElementById('my-form');
const formData = new FormData(form);
```

### **append() vs set()**

```javascript
const formData = new FormData();

// append() - adiciona valor, permite duplicatas
formData.append('tags', 'javascript');
formData.append('tags', 'tutorial');
// Result: tags=javascript&tags=tutorial

// set() - substitui valor existente
formData.set('title', 'First Title');
formData.set('title', 'Second Title'); // Substitui
// Result: title=Second Title
```

### **Outros Métodos**

```javascript
// get() - obter primeiro valor
const title = formData.get('title');

// getAll() - obter todos valores de uma key
const tags = formData.getAll('tags'); // ['javascript', 'tutorial']

// has() - verificar existência
if (formData.has('photo')) {
  console.log('Photo present');
}

// delete() - remover campo
formData.delete('title');

// entries() - iterador
for (const [key, value] of formData.entries()) {
  console.log(`${key}: ${value}`);
}
```

## Basic Multipart com Axios

```javascript
const formData = new FormData();
formData.append('title', 'My Photo');
formData.append('description', 'Beautiful sunset');

const fileInput = document.getElementById('file-input');
const file = fileInput.files[0];
formData.append('photo', file);

// Axios detecta FormData automaticamente
const response = await axios.post('/upload', formData);

// ❌ NÃO fazer isto (Axios configura automaticamente)
await axios.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data' // Falta boundary!
  }
});

// ✅ Axios adiciona Content-Type com boundary automaticamente
```

**Request Headers** (configurados por Axios):
```http
POST /upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryABC123
```

### **Inspecting Multipart Requests**

Para debugar, usar browser DevTools:

1. Abrir DevTools → Network tab
2. Executar upload
3. Clicar no request
4. Ver "Request Payload" ou "Form Data"

**Example**:
```
------WebKitFormBoundaryABC123
Content-Disposition: form-data; name="title"

My Photo
------WebKitFormBoundaryABC123
Content-Disposition: form-data; name="photo"; filename="sunset.jpg"
Content-Type: image/jpeg

(binary)
------WebKitFormBoundaryABC123--
```

## Mixing Data Types

### **Files + Text Fields**

```javascript
const formData = new FormData();

// Text fields
formData.append('username', 'john_doe');
formData.append('email', 'john@example.com');
formData.append('age', 30); // Number converted to string

// File
const file = fileInput.files[0];
formData.append('avatar', file);

await axios.post('/users', formData);
```

**Server recebe**:
```
username: "john_doe"
email: "john@example.com"
age: "30" (string, não number!)
avatar: File object
```

### **JSON + Files**

**Opção 1**: JSON como string

```javascript
const formData = new FormData();

formData.append('file', file);
formData.append('metadata', JSON.stringify({
  title: 'My Photo',
  tags: ['nature', 'sunset'],
  location: { lat: 40.7128, lng: -74.0060 }
}));

await axios.post('/upload', formData);
```

**Server**:
```javascript
// Node.js com multer
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const metadata = JSON.parse(req.body.metadata);
  
  console.log(metadata.title); // "My Photo"
  console.log(metadata.tags); // ['nature', 'sunset']
});
```

**Opção 2**: Campos separados

```javascript
const formData = new FormData();

formData.append('file', file);
formData.append('title', 'My Photo');
formData.append('tags', JSON.stringify(['nature', 'sunset']));
formData.append('location', JSON.stringify({ lat: 40.7128, lng: -74.0060 }));

await axios.post('/upload', formData);
```

### **Arrays em FormData**

```javascript
// Opção 1: Mesmo name múltiplas vezes
const formData = new FormData();
formData.append('tags', 'javascript');
formData.append('tags', 'tutorial');
formData.append('tags', 'axios');

// Server recebe array: ['javascript', 'tutorial', 'axios']
```

```javascript
// Opção 2: JSON string
const formData = new FormData();
formData.append('tags', JSON.stringify(['javascript', 'tutorial', 'axios']));

// Server parseia: JSON.parse(req.body.tags)
```

```javascript
// Opção 3: Indexed names
const formData = new FormData();
formData.append('tags[0]', 'javascript');
formData.append('tags[1]', 'tutorial');
formData.append('tags[2]', 'axios');

// Depende de backend parsing
```

### **Nested Objects**

FormData não suporta nested objects nativamente. Usar JSON:

```javascript
const formData = new FormData();

formData.append('file', file);
formData.append('data', JSON.stringify({
  user: {
    name: 'John Doe',
    email: 'john@example.com'
  },
  settings: {
    privacy: 'public',
    notifications: true
  }
}));

await axios.post('/upload', formData);
```

**Server**:
```javascript
const data = JSON.parse(req.body.data);
console.log(data.user.name); // "John Doe"
console.log(data.settings.privacy); // "public"
```

## Content-Disposition Header

Cada parte do multipart tem `Content-Disposition` header:

### **Text Field**

```http
Content-Disposition: form-data; name="title"
```

### **File Field**

```http
Content-Disposition: form-data; name="photo"; filename="sunset.jpg"
```

**Parameters**:
- `name`: Nome do campo (required)
- `filename`: Nome do arquivo (apenas para files)

### **Escaping Special Characters**

Filenames com caracteres especiais (ex: quotes) devem ser escaped:

```http
Content-Disposition: form-data; name="photo"; filename="my \"photo\".jpg"
```

**FormData/Axios handle automatically**:

```javascript
const file = new File([blob], 'my "photo".jpg', { type: 'image/jpeg' });
formData.append('photo', file);
// Axios escapa filename corretamente
```

### **UTF-8 Filenames**

RFC 5987 permite UTF-8 filenames:

```http
Content-Disposition: form-data; name="photo"; filename*=UTF-8''relat%C3%B3rio.pdf
```

**Note**: `filename*` (com asterisco) é encoding especial. Browsers modernos suportam.

## Backend Integration

### **Node.js (multer)**

```javascript
const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('photo'), (req, res) => {
  const file = req.file;
  // {
  //   fieldname: 'photo',
  //   originalname: 'sunset.jpg',
  //   encoding: '7bit',
  //   mimetype: 'image/jpeg',
  //   destination: 'uploads/',
  //   filename: '1a2b3c4d5e.jpg',
  //   path: 'uploads/1a2b3c4d5e.jpg',
  //   size: 245678
  // }
  
  const title = req.body.title; // Text field
  const description = req.body.description;
  
  res.json({ success: true, fileId: file.filename });
});

// Multiple files
app.post('/upload-multiple', upload.array('photos', 5), (req, res) => {
  const files = req.files; // Array de files
  
  res.json({ success: true, count: files.length });
});
```

### **Spring Boot (MultipartFile)**

```java
@RestController
public class UploadController {
  
  @PostMapping("/upload")
  public ResponseEntity<String> upload(
    @RequestParam("photo") MultipartFile file,
    @RequestParam("title") String title,
    @RequestParam("description") String description
  ) {
    // file.getOriginalFilename() -> "sunset.jpg"
    // file.getSize() -> 245678
    // file.getContentType() -> "image/jpeg"
    // file.getBytes() -> byte[]
    
    return ResponseEntity.ok("Success");
  }
  
  @PostMapping("/upload-multiple")
  public ResponseEntity<String> uploadMultiple(
    @RequestParam("photos") List<MultipartFile> files
  ) {
    return ResponseEntity.ok("Uploaded " + files.size() + " files");
  }
}
```

### **Python (Flask)**

```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['photo']
    title = request.form['title']
    description = request.form['description']
    
    # file.filename -> "sunset.jpg"
    # file.content_type -> "image/jpeg"
    # file.save('uploads/' + file.filename)
    
    return {'success': True}

@app.route('/upload-multiple', methods=['POST'])
def upload_multiple():
    files = request.files.getlist('photos')
    
    return {'success': True, 'count': len(files)}
```

### **Python (FastAPI)**

```python
from fastapi import FastAPI, File, UploadFile, Form

app = FastAPI()

@app.post('/upload')
async def upload(
    photo: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(...)
):
    # photo.filename -> "sunset.jpg"
    # photo.content_type -> "image/jpeg"
    # await photo.read() -> bytes
    
    return {'success': True}

@app.post('/upload-multiple')
async def upload_multiple(photos: list[UploadFile] = File(...)):
    return {'success': True, 'count': len(photos)}
```

### **PHP**

```php
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $file = $_FILES['photo'];
    // $file['name'] -> "sunset.jpg"
    // $file['type'] -> "image/jpeg"
    // $file['size'] -> 245678
    // $file['tmp_name'] -> "/tmp/phpXYZ"
    
    $title = $_POST['title'];
    $description = $_POST['description'];
    
    move_uploaded_file($file['tmp_name'], 'uploads/' . $file['name']);
    
    echo json_encode(['success' => true]);
}
?>
```

## Advanced Patterns

### **Multiple Files com Mesmo Field Name**

**Client**:
```javascript
const formData = new FormData();
const files = fileInput.files; // Multiple files

for (let i = 0; i < files.length; i++) {
  formData.append('photos', files[i]); // Mesmo name 'photos'
}

await axios.post('/upload-multiple', formData);
```

**Server** (Node.js/multer):
```javascript
app.post('/upload-multiple', upload.array('photos', 10), (req, res) => {
  const files = req.files; // Array
  res.json({ count: files.length });
});
```

### **Dynamic Field Names**

```javascript
const formData = new FormData();

files.forEach((file, index) => {
  formData.append(`photo_${index}`, file);
  formData.append(`title_${index}`, file.name);
});

// Result:
// photo_0: File
// title_0: "sunset.jpg"
// photo_1: File
// title_1: "beach.jpg"

await axios.post('/upload', formData);
```

### **File Metadata em FormData**

```javascript
const formData = new FormData();

files.forEach((file) => {
  formData.append('files', file);
  
  // Metadata para cada arquivo (como JSON)
  formData.append('metadata', JSON.stringify({
    originalName: file.name,
    size: file.size,
    type: file.type,
    customTag: 'vacation-2024'
  }));
});

await axios.post('/upload', formData);
```

**Server**:
```javascript
app.post('/upload', upload.array('files'), (req, res) => {
  const files = req.files;
  const metadataArray = req.body.metadata; // Array de strings JSON
  
  files.forEach((file, index) => {
    const metadata = JSON.parse(metadataArray[index]);
    console.log(`File ${file.filename}: ${metadata.customTag}`);
  });
});
```

### **FormData Serialization**

FormData não pode ser diretamente serializado para JSON (contém arquivos binários):

```javascript
// ❌ NÃO funciona
JSON.stringify(formData); // {}

// ✅ Para debug, converter para object
const formDataObject = {};
for (const [key, value] of formData.entries()) {
  if (value instanceof File) {
    formDataObject[key] = {
      name: value.name,
      size: value.size,
      type: value.type
    };
  } else {
    formDataObject[key] = value;
  }
}

console.log(JSON.stringify(formDataObject, null, 2));
```

## Best Practices

### **1. Field Naming Conventions**

```javascript
// ✅ Consistent naming
formData.append('user_name', 'John');
formData.append('user_email', 'john@example.com');
formData.append('user_avatar', file);

// ❌ Inconsistent
formData.append('userName', 'John');
formData.append('email', 'john@example.com');
formData.append('file', file);
```

### **2. Type Conversion (Server-Side)**

FormData converte tudo para strings (exceto Files/Blobs):

```javascript
formData.append('age', 30); // Enviado como "30" (string)
formData.append('isAdmin', true); // Enviado como "true" (string)
```

**Server deve converter**:
```javascript
const age = parseInt(req.body.age);
const isAdmin = req.body.isAdmin === 'true';
```

**Alternative**: Enviar como JSON

```javascript
formData.append('data', JSON.stringify({
  age: 30,
  isAdmin: true
}));

// Server
const data = JSON.parse(req.body.data);
console.log(typeof data.age); // "number"
```

### **3. Size Limits**

Configure size limits server-side:

**Multer**:
```javascript
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // Max 5 files
  }
});
```

**Spring Boot** (application.properties):
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
```

### **4. Security Considerations**

**File Type Validation**:
```javascript
// Client-side (pode ser bypassado)
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}

// Server-side (essencial)
app.post('/upload', upload.single('photo'), (req, res) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (!allowedMimes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type' });
  }
  
  // Verificar magic bytes (ainda mais seguro)
  // ...
});
```

**Filename Sanitization**:
```javascript
// Server-side
const sanitizeFilename = (filename) => {
  // Remover path traversal
  return filename.replace(/\.\./g, '').replace(/\//g, '');
};

const safeFilename = sanitizeFilename(req.file.originalname);
```

**File Size Limits**:
```javascript
// Client-side
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
if (file.size > MAX_SIZE) {
  alert('File too large');
  return;
}

// Server-side (enforce)
```

---

# 🎯 Aplicabilidade

## Quando Usar Multipart/Form-Data

**File Uploads**: Qualquer upload de arquivo requer multipart.

**Files + Metadata**: Upload de arquivo com informações adicionais.

**Multiple Files**: Upload de múltiplos arquivos em single request.

**Form Submissions com Files**: Forms HTML com `<input type="file">`.

## Quando Considerar Alternativas

**JSON Only**: Se não há arquivos, application/json é mais eficiente.

**Large Files**: Para arquivos > 100MB, considerar chunked upload ou direct-to-storage (S3).

---

# ⚠️ Limitações

## Size Limits

Servers e proxies têm limites de request size. Configurar apropriadamente.

## No Native JSON Support

Nested objects devem ser stringified manualmente.

## Type Coercion

Todos valores (exceto Files) são convertidos para strings.

## Memory Usage

FormData carrega tudo em memória. Para arquivos muito grandes, considerar streaming.

---

# 🔗 Interconexões

## Enables File Upload

Multipart/form-data é protocolo padrão para file uploads.

## Works with FormData API

Browser API para construir multipart data.

## Axios Automatic Handling

Axios detecta FormData e configura headers automaticamente.

---

# 🚀 Evolução

## Fetch API Support

Fetch também suporta FormData (similar ao Axios).

## GraphQL File Uploads

GraphQL multipart request specification para uploads.

## Resumable Uploads

Protocols como tus.io para uploads resumable (não usam multipart tradicional).

---

**Conclusão Integrada**: Multipart/form-data é encoding essencial para transferir arquivos e dados heterogêneos em HTTP. Axios simplifica uso via detecção automática de FormData e configuração de Content-Type com boundary. FormData API permite mixing de files, strings, e JSON stringified em single request. Backend frameworks (multer, Spring Boot, FastAPI) provêm parsing nativo de multipart requests. Best practices incluem validação server-side de tipos e tamanhos, sanitização de filenames, e compreensão de type coercion (valores convertidos para strings). Multipart forma foundation de file upload ecosystem, completando ciclo de upload/download/progress que caracteriza operações de file transfer modernas.