# 🎯 Introdução

**Generics and Interceptors** em TypeScript Axios combinam **generic type parameters** com **interceptor typing** para criar type-safe request/response transformation pipelines, ensuring interceptor logic mantém type consistency através de entire request/response lifecycle, enabling compile-time validation de header additions, data transformations, error handling, e configuration modifications.

O problema fundamental que generics resolvem em interceptors é **type preservation**: interceptors modify requests/responses (add headers, transform data, handle errors), mas sem proper typing, TypeScript não sabe que `config.headers.Authorization` foi added por interceptor, ou que `response.data` foi transformed de snake_case para camelCase. Generics allow **type-level tracking** de transformations, ensuring downstream code has accurate type information.

Interceptor typing patterns incluem: **request interceptor generics** (`InternalAxiosRequestConfig<D>` preserving request data type), **response interceptor generics** (`AxiosResponse<T, D>` preserving response/request types), **error interceptor typing** (`AxiosError<T, D>` typing error response data), **chained interceptor types** (tracking cumulative transformations através de multiple interceptors), **conditional interceptor types** (different types baseado em config properties).

Critical typing considerations: **header augmentation** (adding headers requires extending HeadersDefaults interface), **config extension** (custom config properties require extending AxiosRequestConfig), **data transformation** (transforming response.data changes T type parameter), **interceptor registration** (use method returns eject ID), **async interceptors** (Promise-based interceptors require proper Promise typing).

Generic patterns para interceptors: **generic auth interceptor** (`<D = any>(config: InternalAxiosRequestConfig<D>)` works com any request data type), **generic transformer** (`<T>(response: AxiosResponse<T>)` transforms any response type), **generic error handler** (`<T = unknown, D = any>(error: AxiosError<T, D>)` handles any error type), **conditional generics** (different return types baseado em config).

Advanced patterns incluem: **branded types** para tracking interceptor applications (ensuring auth interceptor ran before making request), **builder pattern** para type-safe interceptor chains (fluent API building interceptor pipeline), **middleware composition** (combining multiple interceptors with type preservation), **interceptor context** (passing typed metadata through interceptor chain).

Este módulo explora comprehensive interceptor typing: desde basic type annotations para request/response interceptors, através de generic patterns preserving types através de transformations, até advanced techniques (branded types, builder patterns, middleware composition, type-safe configuration extensions). Objetivo é fornecer complete understanding para building robust, type-safe interceptor systems.

---

# 📋 Sumário

### **Interceptor Type Basics**
- InternalAxiosRequestConfig<D>
- AxiosResponse<T, D>
- AxiosError<T, D>
- Interceptor signatures

### **Request Interceptor Typing**
- Adding headers
- Modifying config
- Generic request interceptors
- Type preservation

### **Response Interceptor Typing**
- Data transformations
- Generic response interceptors
- Type narrowing
- Chained transformations

### **Error Interceptor Typing**
- Error response typing
- Generic error handlers
- Error recovery typing
- Type guards

### **Generic Interceptor Patterns**
- Reusable interceptors
- Type parameters
- Constraints
- Default types

### **Config Extension Typing**
- Custom config properties
- Module augmentation
- Type merging
- Declaration merging

### **Interceptor Chains**
- Multiple interceptors
- Type composition
- Execution order
- Type accumulation

### **Advanced Patterns**
- Branded types
- Builder pattern
- Middleware composition
- Context passing

---

# 🧠 Fundamentos

## Interceptor Type Basics

### **InternalAxiosRequestConfig<D>**

**Request config type**:

```typescript
import type { InternalAxiosRequestConfig } from 'axios';

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // config properties typed
    config.url; // string | undefined
    config.method; // Method | undefined
    config.headers; // AxiosRequestHeaders
    config.data; // any (or D if specified)
    
    return config;
  }
);
```

**Generic data type**:

```typescript
interface CreateUserRequest {
  name: string;
  email: string;
}

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig<CreateUserRequest>) => {
    // config.data typed as CreateUserRequest
    console.log(config.data?.name);
    console.log(config.data?.email);
    
    return config;
  }
);
```

### **AxiosResponse<T, D>**

**Response type**:

```typescript
import type { AxiosResponse } from 'axios';

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // response properties typed
    response.data; // any (or T if specified)
    response.status; // number
    response.headers; // AxiosResponseHeaders
    response.config; // InternalAxiosRequestConfig<D>
    
    return response;
  }
);
```

**Generic response/request types**:

```typescript
interface User {
  id: number;
  name: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

axios.interceptors.response.use(
  (response: AxiosResponse<User, CreateUserRequest>) => {
    // response.data typed as User
    console.log(response.data.id);
    console.log(response.data.name);
    
    // response.config.data typed as CreateUserRequest
    console.log(response.config.data?.name);
    
    return response;
  }
);
```

### **AxiosError<T, D>**

**Error type**:

```typescript
import type { AxiosError } from 'axios';

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // error properties typed
    error.response; // AxiosResponse | undefined
    error.request; // any
    error.message; // string
    error.config; // InternalAxiosRequestConfig | undefined
    
    return Promise.reject(error);
  }
);
```

**Generic error types**:

```typescript
interface ErrorResponse {
  message: string;
  code: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse, CreateUserRequest>) => {
    // error.response.data typed as ErrorResponse
    console.log(error.response?.data.message);
    console.log(error.response?.data.code);
    
    // error.config.data typed as CreateUserRequest
    console.log(error.config?.data?.name);
    
    return Promise.reject(error);
  }
);
```

### **Interceptor Signatures**

**Request interceptor signature**:

```typescript
type RequestInterceptor = (
  config: InternalAxiosRequestConfig
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
```

**Response interceptor signature**:

```typescript
type ResponseInterceptor<T = any> = (
  response: AxiosResponse<T>
) => AxiosResponse<T> | Promise<AxiosResponse<T>>;
```

**Error interceptor signature**:

```typescript
type ErrorInterceptor = (
  error: AxiosError
) => Promise<never> | Promise<AxiosResponse>;
```

## Request Interceptor Typing

### **Adding Headers**

**Type-safe header addition**:

```typescript
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Authorization'] = 'Bearer token123';
    config.headers['X-Api-Key'] = 'key456';
    
    return config;
  }
);
```

**Conditional header addition**:

```typescript
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  }
);
```

### **Modifying Config**

**URL modification**:

```typescript
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url && !config.url.startsWith('http')) {
      config.url = `/api/v1${config.url}`;
    }
    
    return config;
  }
);
```

**Params modification**:

```typescript
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    
    return config;
  }
);
```

### **Generic Request Interceptors**

**Reusable auth interceptor**:

```typescript
const createAuthInterceptor = <D = any>(
  getToken: () => string | null
) => {
  return (config: InternalAxiosRequestConfig<D>): InternalAxiosRequestConfig<D> => {
    const token = getToken();
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  };
};

// Usage
axios.interceptors.request.use(
  createAuthInterceptor(() => localStorage.getItem('token'))
);
```

**Generic logging interceptor**:

```typescript
const createLoggingInterceptor = <D = any>() => {
  return (config: InternalAxiosRequestConfig<D>): InternalAxiosRequestConfig<D> => {
    console.log(`[${config.method?.toUpperCase()}] ${config.url}`);
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    
    return config;
  };
};

axios.interceptors.request.use(createLoggingInterceptor());
```

### **Type Preservation**

**Preserve request data type**:

```typescript
interface CreateUserRequest {
  name: string;
  email: string;
}

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig<CreateUserRequest>) => {
    // config.data typed as CreateUserRequest | undefined
    if (config.data) {
      console.log(config.data.name); // Type-safe
      console.log(config.data.email); // Type-safe
    }
    
    return config;
  }
);
```

## Response Interceptor Typing

### **Data Transformations**

**Unwrap nested data**:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, any>;
}

interface User {
  id: number;
  name: string;
}

axios.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<User>>): AxiosResponse<User> => {
    // Transform response.data from ApiResponse<User> to User
    return {
      ...response,
      data: response.data.data
    };
  }
);

// Now response.data is User, not ApiResponse<User>
const response = await axios.get<User>('/users/1');
console.log(response.data.name); // Direct access
```

**CamelCase conversion**:

```typescript
interface UserSnake {
  user_id: number;
  user_name: string;
  email_address: string;
}

interface User {
  userId: number;
  userName: string;
  emailAddress: string;
}

const toCamelCase = (obj: any): any => {
  // Implementation
};

axios.interceptors.response.use(
  (response: AxiosResponse<UserSnake>): AxiosResponse<User> => {
    return {
      ...response,
      data: toCamelCase(response.data)
    };
  }
);
```

### **Generic Response Interceptors**

**Generic unwrapper**:

```typescript
interface ApiWrapper<T> {
  success: boolean;
  data: T;
}

const createUnwrapInterceptor = <T>() => {
  return (response: AxiosResponse<ApiWrapper<T>>): AxiosResponse<T> => {
    return {
      ...response,
      data: response.data.data
    };
  };
};

// Usage
axios.interceptors.response.use(createUnwrapInterceptor());
```

**Generic transformer**:

```typescript
type TransformFn<From, To> = (data: From) => To;

const createTransformInterceptor = <From, To>(
  transform: TransformFn<From, To>
) => {
  return (response: AxiosResponse<From>): AxiosResponse<To> => {
    return {
      ...response,
      data: transform(response.data)
    };
  };
};

// Usage
const snakeToCamel = (data: UserSnake): User => ({
  userId: data.user_id,
  userName: data.user_name,
  emailAddress: data.email_address
});

axios.interceptors.response.use(createTransformInterceptor(snakeToCamel));
```

### **Type Narrowing**

**Discriminated union narrowing**:

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

axios.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<User>>): AxiosResponse<User> => {
    if (response.data.success) {
      return {
        ...response,
        data: response.data.data
      };
    } else {
      throw new Error(response.data.error);
    }
  }
);
```

### **Chained Transformations**

**Multiple transformations**:

```typescript
// Interceptor 1: Unwrap
axios.interceptors.response.use(
  (response: AxiosResponse<ApiWrapper<UserSnake>>): AxiosResponse<UserSnake> => {
    return {
      ...response,
      data: response.data.data
    };
  }
);

// Interceptor 2: Transform to camelCase
axios.interceptors.response.use(
  (response: AxiosResponse<UserSnake>): AxiosResponse<User> => {
    return {
      ...response,
      data: toCamelCase(response.data)
    };
  }
);

// Final type is User
const response = await axios.get<User>('/users/1');
console.log(response.data.userName);
```

## Error Interceptor Typing

### **Error Response Typing**

**Type error response**:

```typescript
interface ErrorResponse {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      console.error('Error:', error.response.data.message);
      console.error('Code:', error.response.data.code);
      console.error('Details:', error.response.data.details);
    }
    
    return Promise.reject(error);
  }
);
```

### **Generic Error Handlers**

**Reusable error handler**:

```typescript
const createErrorHandler = <T = unknown>() => {
  return (error: AxiosError<T>) => {
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('Network error');
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  };
};

axios.interceptors.response.use(
  (response) => response,
  createErrorHandler<ErrorResponse>()
);
```

**Error transformer**:

```typescript
interface ApiError {
  message: string;
  code: string;
}

interface AppError {
  userMessage: string;
  errorCode: string;
  timestamp: Date;
}

const createErrorTransformer = <From, To>(
  transform: (error: From) => To
) => {
  return (error: AxiosError<From>): Promise<never> => {
    if (error.response) {
      const transformed = transform(error.response.data);
      const newError = new Error(JSON.stringify(transformed));
      return Promise.reject(newError);
    }
    
    return Promise.reject(error);
  };
};

// Usage
const transformError = (apiError: ApiError): AppError => ({
  userMessage: apiError.message,
  errorCode: apiError.code,
  timestamp: new Date()
});

axios.interceptors.response.use(
  (response) => response,
  createErrorTransformer(transformError)
);
```

### **Error Recovery Typing**

**Type-safe recovery**:

```typescript
interface User {
  id: number;
  name: string;
}

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>): Promise<AxiosResponse<User>> => {
    if (error.response?.status === 404) {
      // Return default user
      return Promise.resolve({
        data: { id: 0, name: 'Unknown' },
        status: 200,
        statusText: 'OK (Fallback)',
        headers: {},
        config: error.config!
      });
    }
    
    return Promise.reject(error);
  }
);
```

### **Type Guards**

**Custom type guard**:

```typescript
interface ValidationError {
  type: 'validation';
  fields: Record<string, string[]>;
}

interface AuthError {
  type: 'auth';
  message: string;
}

type ApiError = ValidationError | AuthError;

const isValidationError = (error: ApiError): error is ValidationError => {
  return error.type === 'validation';
};

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const errorData = error.response.data;
      
      if (isValidationError(errorData)) {
        console.error('Validation errors:', errorData.fields);
      } else {
        console.error('Auth error:', errorData.message);
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Generic Interceptor Patterns

### **Reusable Interceptors**

**Generic auth interceptor**:

```typescript
interface AuthConfig<D = any> extends InternalAxiosRequestConfig<D> {
  skipAuth?: boolean;
}

const createAuthInterceptor = <D = any>(
  getToken: () => Promise<string | null>
) => {
  return async (config: AuthConfig<D>): Promise<InternalAxiosRequestConfig<D>> => {
    if (config.skipAuth) {
      return config;
    }
    
    const token = await getToken();
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  };
};
```

**Generic cache interceptor**:

```typescript
interface CacheConfig<D = any> extends InternalAxiosRequestConfig<D> {
  cache?: boolean;
  cacheTTL?: number;
}

const createCacheInterceptor = <T>(cache: Map<string, any>) => {
  return (response: AxiosResponse<T>): AxiosResponse<T> => {
    const config = response.config as CacheConfig;
    
    if (config.cache && config.url) {
      cache.set(config.url, response.data);
    }
    
    return response;
  };
};
```

### **Type Parameters**

**Multiple type parameters**:

```typescript
const createTransformInterceptor = <TInput, TOutput, DInput = any>(
  transformResponse: (data: TInput) => TOutput,
  transformRequest?: (data: DInput) => DInput
) => {
  const requestInterceptor = (
    config: InternalAxiosRequestConfig<DInput>
  ): InternalAxiosRequestConfig<DInput> => {
    if (transformRequest && config.data) {
      config.data = transformRequest(config.data);
    }
    return config;
  };
  
  const responseInterceptor = (
    response: AxiosResponse<TInput>
  ): AxiosResponse<TOutput> => {
    return {
      ...response,
      data: transformResponse(response.data)
    };
  };
  
  return { requestInterceptor, responseInterceptor };
};
```

### **Constraints**

**Generic constraints**:

```typescript
interface Identifiable {
  id: number;
}

const createIdValidationInterceptor = <T extends Identifiable>() => {
  return (response: AxiosResponse<T>): AxiosResponse<T> => {
    if (response.data.id <= 0) {
      throw new Error('Invalid ID');
    }
    
    return response;
  };
};

// Only works with types having 'id' property
axios.interceptors.response.use(
  createIdValidationInterceptor<User>()
);
```

### **Default Types**

**Provide defaults**:

```typescript
const createLoggingInterceptor = <T = any, D = any>(
  logger: (message: string) => void = console.log
) => {
  const requestInterceptor = (
    config: InternalAxiosRequestConfig<D>
  ): InternalAxiosRequestConfig<D> => {
    logger(`Request: ${config.method} ${config.url}`);
    return config;
  };
  
  const responseInterceptor = (
    response: AxiosResponse<T>
  ): AxiosResponse<T> => {
    logger(`Response: ${response.status}`);
    return response;
  };
  
  return { requestInterceptor, responseInterceptor };
};
```

## Config Extension Typing

### **Custom Config Properties**

**Extend config interface**:

```typescript
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
    retryCount?: number;
    cache?: boolean;
  }
}

// Now available in interceptors
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.skipAuth) {
      // Skip auth logic
    }
    
    if (config.retryCount) {
      console.log(`Retry attempt: ${config.retryCount}`);
    }
    
    return config;
  }
);
```

### **Module Augmentation**

**Add custom properties**:

```typescript
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime?: number;
      requestId?: string;
    };
  }
}

axios.interceptors.request.use(
  (config) => {
    config.metadata = {
      startTime: Date.now(),
      requestId: generateRequestId()
    };
    
    return config;
  }
);

axios.interceptors.response.use(
  (response) => {
    const duration = Date.now() - (response.config.metadata?.startTime ?? 0);
    console.log(`Request took ${duration}ms`);
    
    return response;
  }
);
```

### **Type Merging**

**Merge with existing types**:

```typescript
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    customHeaders?: Record<string, string>;
  }
}

axios.interceptors.request.use(
  (config) => {
    if (config.customHeaders) {
      Object.entries(config.customHeaders).forEach(([key, value]) => {
        config.headers[key] = value;
      });
    }
    
    return config;
  }
);

// Usage
axios.get('/users', {
  customHeaders: {
    'X-Custom-1': 'value1',
    'X-Custom-2': 'value2'
  }
});
```

### **Declaration Merging**

**Extend AxiosRequestConfig**:

```typescript
declare module 'axios' {
  export interface AxiosRequestConfig {
    feature?: {
      enableLogging?: boolean;
      enableMetrics?: boolean;
    };
  }
  
  export interface InternalAxiosRequestConfig {
    feature?: {
      enableLogging?: boolean;
      enableMetrics?: boolean;
    };
  }
}
```

## Interceptor Chains

### **Multiple Interceptors**

**Type-preserving chain**:

```typescript
// Interceptor 1: Add auth
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Authorization'] = 'Bearer token';
    return config;
  }
);

// Interceptor 2: Add request ID
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['X-Request-ID'] = generateId();
    return config;
  }
);

// Interceptor 3: Add timestamp
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['X-Timestamp'] = Date.now().toString();
    return config;
  }
);
```

### **Type Composition**

**Compose transformations**:

```typescript
type Transform<From, To> = (data: From) => To;

const compose = <A, B, C>(
  f: Transform<A, B>,
  g: Transform<B, C>
): Transform<A, C> => {
  return (data: A) => g(f(data));
};

// Usage
const unwrap = (data: ApiWrapper<UserSnake>) => data.data;
const toCamel = (data: UserSnake): User => ({
  userId: data.user_id,
  userName: data.user_name,
  emailAddress: data.email_address
});

const transform = compose(unwrap, toCamel);

axios.interceptors.response.use(
  (response: AxiosResponse<ApiWrapper<UserSnake>>): AxiosResponse<User> => {
    return {
      ...response,
      data: transform(response.data)
    };
  }
);
```

### **Execution Order**

**Order matters**:

```typescript
// Request interceptors execute in REVERSE order
axios.interceptors.request.use((config) => {
  console.log('3rd'); // Executes 3rd
  return config;
});

axios.interceptors.request.use((config) => {
  console.log('2nd'); // Executes 2nd
  return config;
});

axios.interceptors.request.use((config) => {
  console.log('1st'); // Executes 1st
  return config;
});

// Response interceptors execute in REGISTRATION order
axios.interceptors.response.use((response) => {
  console.log('1st'); // Executes 1st
  return response;
});

axios.interceptors.response.use((response) => {
  console.log('2nd'); // Executes 2nd
  return response;
});

axios.interceptors.response.use((response) => {
  console.log('3rd'); // Executes 3rd
  return response;
});
```

### **Type Accumulation**

**Track cumulative types**:

```typescript
// Start with raw API response
type Step0 = ApiWrapper<UserSnake>;

// After unwrap interceptor
type Step1 = UserSnake;

// After camelCase interceptor
type Step2 = User;

// Final type
const response = await axios.get<Step2>('/users/1');
console.log(response.data.userName);
```

## Advanced Patterns

### **Branded Types**

**Ensure interceptor ran**:

```typescript
declare const AuthenticatedBrand: unique symbol;

type Authenticated<T> = T & { [AuthenticatedBrand]: true };

const authenticateConfig = <D>(
  config: InternalAxiosRequestConfig<D>
): InternalAxiosRequestConfig<D> & Authenticated<InternalAxiosRequestConfig<D>> => {
  config.headers['Authorization'] = 'Bearer token';
  return config as any;
};

// Only accepts authenticated configs
const sendAuthenticatedRequest = <D>(
  config: Authenticated<InternalAxiosRequestConfig<D>>
) => {
  return axios.request(config);
};

// Usage
const config = axios.defaults;
const authenticatedConfig = authenticateConfig(config);
sendAuthenticatedRequest(authenticatedConfig); // ✅ Works

// sendAuthenticatedRequest(config); // ❌ Type error
```

### **Builder Pattern**

**Type-safe builder**:

```typescript
class InterceptorBuilder<T = any, D = any> {
  private requestInterceptors: Array<
    (config: InternalAxiosRequestConfig<D>) => InternalAxiosRequestConfig<D>
  > = [];
  
  private responseInterceptors: Array<
    (response: AxiosResponse<T>) => AxiosResponse<T>
  > = [];
  
  addAuth(getToken: () => string | null): this {
    this.requestInterceptors.push((config) => {
      const token = getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
    return this;
  }
  
  addLogging(): this {
    this.requestInterceptors.push((config) => {
      console.log(`[${config.method}] ${config.url}`);
      return config;
    });
    return this;
  }
  
  transform<U>(fn: (data: T) => U): InterceptorBuilder<U, D> {
    const newBuilder = new InterceptorBuilder<U, D>();
    newBuilder.requestInterceptors = [...this.requestInterceptors];
    newBuilder.responseInterceptors = [
      ...this.responseInterceptors.map(interceptor => 
        (response: AxiosResponse<any>) => interceptor(response)
      ),
      (response: AxiosResponse<T>): AxiosResponse<U> => ({
        ...response,
        data: fn(response.data)
      })
    ];
    return newBuilder;
  }
  
  build(instance: AxiosInstance = axios): void {
    this.requestInterceptors.forEach(interceptor => {
      instance.interceptors.request.use(interceptor);
    });
    
    this.responseInterceptors.forEach(interceptor => {
      instance.interceptors.response.use(interceptor);
    });
  }
}

// Usage
new InterceptorBuilder<ApiWrapper<UserSnake>>()
  .addAuth(() => localStorage.getItem('token'))
  .addLogging()
  .transform(data => data.data) // ApiWrapper<UserSnake> -> UserSnake
  .transform(toCamelCase) // UserSnake -> User
  .build();
```

### **Middleware Composition**

**Composable middleware**:

```typescript
type Middleware<T, U> = (
  response: AxiosResponse<T>
) => AxiosResponse<U>;

const composeMiddleware = <A, B, C>(
  first: Middleware<A, B>,
  second: Middleware<B, C>
): Middleware<A, C> => {
  return (response) => second(first(response));
};

// Usage
const unwrapMiddleware: Middleware<ApiWrapper<User>, User> = (response) => ({
  ...response,
  data: response.data.data
});

const logMiddleware: Middleware<User, User> = (response) => {
  console.log('User:', response.data.name);
  return response;
};

const composed = composeMiddleware(unwrapMiddleware, logMiddleware);

axios.interceptors.response.use(composed);
```

### **Context Passing**

**Pass metadata through chain**:

```typescript
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    context?: {
      startTime?: number;
      userId?: string;
      traceId?: string;
    };
  }
}

// Interceptor 1: Add context
axios.interceptors.request.use((config) => {
  config.context = {
    startTime: Date.now(),
    userId: getCurrentUserId(),
    traceId: generateTraceId()
  };
  return config;
});

// Interceptor 2: Use context
axios.interceptors.response.use((response) => {
  const duration = Date.now() - (response.config.context?.startTime ?? 0);
  
  console.log('Request metadata:', {
    duration,
    userId: response.config.context?.userId,
    traceId: response.config.context?.traceId
  });
  
  return response;
});
```

---

# 🎯 Aplicabilidade

## Quando Usar Generic Interceptors

**Reusable Logic**: Auth, logging, transformation patterns repeated across projects.

**Type Safety**: Ensuring transformations preserve type information.

**Complex Pipelines**: Multiple transformations requiring type tracking.

## Trade-offs

**Complexity**: Generic types add cognitive overhead.

**Learning Curve**: Requires TypeScript expertise.

**Verbosity**: More type annotations needed.

---

# ⚠️ Limitações

## Type Erasure

TypeScript types removed at runtime - interceptors execute regardless.

**Solution**: Combine with runtime validation.

## Type Inference

Complex interceptor chains pode confuse type inference.

**Solution**: Explicit type annotations at chain boundaries.

---

# 🔗 Interconexões

## Generic API Clients

Interceptors integral to type-safe API clients (próximo módulo).

## Middleware Patterns

Composable interceptors similar to Express/Koa middleware.

## Functional Programming

Interceptor composition applies FP concepts.

---

# 🚀 Evolução

## Effect Systems

Track side effects (caching, logging) at type level.

## Dependency Injection

Type-safe DI for interceptor dependencies.

## Aspect-Oriented Programming

Interceptors as cross-cutting concerns.

---

**Conclusão Integrada**: Generics and interceptors em TypeScript Axios enable **type-safe request/response transformation pipelines** através de generic type parameters (`InternalAxiosRequestConfig<D>`, `AxiosResponse<T, D>`, `AxiosError<T, D>`) preserving types através de entire lifecycle. Core patterns: **request interceptor typing** via `(config: InternalAxiosRequestConfig<D>) => InternalAxiosRequestConfig<D>` ensures modifications (header additions, URL transformations, param additions) preserve request data type D, **response interceptor typing** via `(response: AxiosResponse<T>) => AxiosResponse<U>` enables type transformations (unwrapping ApiWrapper<T> to T, converting snake_case to camelCase), **error interceptor typing** via `(error: AxiosError<ErrorResponse, RequestType>)` types error.response.data and error.config.data. Generic patterns enable reusability: **generic auth interceptor** `<D = any>` works com any request type, **generic transformer** `<TInput, TOutput>` transforms any response shape, **generic error handler** `<T = unknown, D = any>` handles any error type. Advanced techniques: **config extension** via module augmentation adding custom properties (skipAuth, retryCount, cache), **interceptor chains** composing multiple transformations com type preservation (unwrap → camelCase → validate), **branded types** ensuring interceptors ran (Authenticated<Config> prevents unauthenticated requests), **builder pattern** providing fluent API para constructing type-safe interceptor pipelines. Critical considerations: **execution order** (request interceptors reverse registration, response interceptors registration order), **type composition** (tracking cumulative transformations Step0 → Step1 → Step2), **async interceptors** requiring Promise<InternalAxiosRequestConfig> return type. Module augmentation pattern: `declare module 'axios' { export interface InternalAxiosRequestConfig { customProp?: T } }` extends Axios types globally. Best practices: use generic defaults (`<T = any, D = any>`) para flexibility, provide type constraints (`<T extends Identifiable>`) quando needed, compose transformations via higher-order functions, leverage middleware patterns para reusable logic, pass metadata via context object através de chain.