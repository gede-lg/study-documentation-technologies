# 🎯 Introdução

**GraphQL com Axios** envolve querying GraphQL APIs via HTTP POST requests (**single endpoint**, **flexible queries**, **precise data fetching**, **type system**), constructing query/mutation strings (selecting specific fields, nested resources, variables), handling GraphQL-specific responses (data/errors structure), implementing client utilities (query builder, variable management, error handling), integrating GraphQL clients (Apollo, urql) versus raw Axios, addressing over-fetching/under-fetching limitations de REST.

O problema fundamental que GraphQL resolve: REST APIs often suffer **over-fetching** (retrieving more data than needed - `GET /users` returns all fields when only name/email needed), **under-fetching** (requiring multiple requests for related data - `GET /users/123` then `GET /users/123/posts` then `GET /posts/123/comments`), **versioning complexity** (maintaining `/api/v1/users`, `/api/v2/users` as requirements evolve), **endpoint proliferation** (dozens of endpoints for different data combinations).

GraphQL fundamentals: **Single endpoint** (typically `/graphql` handling all queries/mutations), **Query language** (client specifies exact fields needed), **Type system** (schema defining available types/fields/relationships), **Strongly typed** (queries validated against schema), **Introspection** (schema queryable for documentation/tooling).

Query structure: Client sends POST request to `/graphql` with JSON body containing `query` (GraphQL query string), `variables` (dynamic values), `operationName` (for multiple operations). Server responds with `data` (requested data matching query shape), `errors` (array of errors if any occurred).

GraphQL vs REST comparison:

**REST**:
```
GET /users/123
GET /users/123/posts
GET /posts/456/comments
```
Three requests, potential over-fetching (each endpoint returns all fields).

**GraphQL**:
```graphql
query {
  user(id: 123) {
    name
    email
    posts {
      title
      comments {
        text
      }
    }
  }
}
```
Single request, precise data (only name/email/posts/comments), nested resources em one query.

Axios integration: GraphQL over HTTP uses POST requests to single `/graphql` endpoint. Axios sends query as request body:

```javascript
axios.post('/graphql', {
  query: `
    query GetUser($id: ID!) {
      user(id: $id) {
        name
        email
      }
    }
  `,
  variables: { id: 123 }
});
```

Response structure:

```javascript
// Success
{
  "data": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}

// Error
{
  "data": null,
  "errors": [
    {
      "message": "User not found",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["user"]
    }
  ]
}
```

Query types: **Queries** (read operations like `query { users { name } }`), **Mutations** (write operations like `mutation { createUser(input: { name: "John" }) { id } }`), **Subscriptions** (real-time updates via WebSocket - not HTTP/Axios).

Advantages over REST: **Precise fetching** (request exactly needed fields eliminating over-fetching), **Single request** (nested resources em one query eliminating under-fetching), **Strong typing** (schema validation preventing invalid queries), **Self-documenting** (introspection enables automatic documentation), **Versioning optional** (evolve schema by adding fields without breaking changes).

Challenges: **Complexity** (learning curve for GraphQL query language), **Caching** (REST benefits from HTTP caching; GraphQL requires custom strategies), **File uploads** (requires multipart spec não native to GraphQL), **N+1 problem** (naive implementations making database query per item - requires DataLoader), **Over-querying** (clients can request expensive nested queries - requires query complexity limits).

Axios patterns for GraphQL: **Query builder functions** (constructing query strings programmatically), **Variable management** (type-safe variable passing), **Error handling** (checking both HTTP errors and GraphQL errors array), **Request wrapper** (abstracting common GraphQL request pattern), **TypeScript integration** (typing query results).

When to use Axios for GraphQL: **Simple queries** (few GraphQL requests, não need for full client), **Learning/prototyping** (understanding GraphQL before adopting full client), **Existing Axios infrastructure** (leveraging existing interceptors/config), **Lightweight** (avoiding Apollo/urql bundle size).

When to use dedicated GraphQL client (Apollo, urql): **Complex applications** (many GraphQL queries/mutations), **Advanced features** (normalized caching, optimistic updates, subscriptions), **Developer experience** (hooks, code generation, DevTools), **Production apps** (battle-tested libraries with community support).

GraphQL clients comparison:

**Apollo Client**: Full-featured, normalized cache, React hooks, large bundle (~50KB), extensive ecosystem.

**urql**: Lightweight (~10KB), flexible caching, React/Vue/Svelte support, simpler API.

**Raw Axios**: Minimal bundle, manual caching, manual error handling, full control.

Advanced patterns incluem: **Fragments** (reusable query pieces), **Aliases** (renaming fields em response), **Directives** (`@include`, `@skip` conditional fields), **Inline fragments** (querying union types), **Batch requests** (multiple queries em single HTTP request).

Este módulo explora comprehensive GraphQL integration via Axios: desde core concepts (GraphQL fundamentals, query structure, type system), através de implementation techniques (query construction, variable passing, error handling, response typing), até comparison with dedicated clients (Apollo, urql) and decision criteria for choosing raw Axios versus full-featured library. Objetivo é fornecer complete understanding para consuming GraphQL APIs with Axios em production applications.

---

# 📋 Sumário

### **GraphQL Fundamentals**
- Single endpoint
- Query language
- Type system
- Introspection

### **GraphQL vs REST**
- Over-fetching
- Under-fetching
- Endpoint proliferation
- Precise data fetching

### **Request Structure**
- POST to /graphql
- Query string
- Variables
- Operation name

### **Response Structure**
- Data field
- Errors array
- Null handling
- Partial responses

### **Queries**
- Field selection
- Nested queries
- Arguments
- Aliases

### **Mutations**
- Create operations
- Update operations
- Delete operations
- Input types

### **Axios Integration**
- Basic queries
- Variables
- Error handling
- Response typing

### **Query Builder**
- Programmatic construction
- Template literals
- Type safety
- Reusability

### **Advanced Patterns**
- Fragments
- Directives
- Inline fragments
- Batch requests

### **GraphQL Clients**
- Apollo Client
- urql
- When to use Axios
- Comparison

---

# 🧠 Fundamentos

## GraphQL Fundamentals

### **Single Endpoint**

**Unified entry point**:

Unlike REST (multiple endpoints `/users`, `/posts`, `/products`), GraphQL uses **single endpoint** (typically `/graphql`) handling all queries/mutations.

```javascript
// REST: Multiple endpoints
GET  /api/users
GET  /api/posts
GET  /api/products

// GraphQL: Single endpoint
POST /graphql
```

**Benefits**:
- Simplified routing (one endpoint to manage)
- Consistent URL structure
- Easier versioning (evolve schema instead of endpoints)

**Axios configuration**:

```javascript
const graphqlClient = axios.create({
  baseURL: 'https://api.example.com/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

### **Query Language**

**Declarative data fetching**:

Client specifies **exactly what data** needed using GraphQL query language:

```graphql
# Get user with specific fields
query {
  user(id: 123) {
    name
    email
  }
}

# Get user with nested posts
query {
  user(id: 123) {
    name
    posts {
      title
      publishedAt
    }
  }
}

# Multiple resources in one query
query {
  user(id: 123) {
    name
  }
  posts(limit: 10) {
    title
  }
}
```

**Axios request**:

```javascript
axios.post('/graphql', {
  query: `
    query {
      user(id: 123) {
        name
        email
      }
    }
  `
});
```

### **Type System**

**Schema-defined structure**:

GraphQL schema defines available **types**, **fields**, **relationships**:

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  role: Role!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
}

enum Role {
  ADMIN
  EDITOR
  VIEWER
}

type Query {
  user(id: ID!): User
  users(limit: Int): [User!]!
  post(id: ID!): Post
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}
```

**Benefits**:
- Strong typing (queries validated against schema)
- Self-documenting (schema serves as documentation)
- Tooling support (autocomplete, validation)
- Refactoring safety (renaming fields detected)

### **Introspection**

**Queryable schema**:

GraphQL schema can be queried for its own structure:

```javascript
// Get all types
axios.post('/graphql', {
  query: `
    query {
      __schema {
        types {
          name
          kind
          fields {
            name
            type {
              name
            }
          }
        }
      }
    }
  `
});

// Get specific type
axios.post('/graphql', {
  query: `
    query {
      __type(name: "User") {
        name
        fields {
          name
          type {
            name
          }
        }
      }
    }
  `
});
```

**Enables**: Automatic documentation tools (GraphiQL, GraphQL Playground), code generation, client validation.

## GraphQL vs REST

### **Over-Fetching**

**REST problem**:

```javascript
// GET /users/123 returns ALL fields
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "bio": "Long bio text...",
  "avatar": "https://...",
  "settings": { /* lots of data */ },
  "createdAt": "2025-01-01",
  "updatedAt": "2025-11-17"
}

// Frontend only needs name and email
// Wasted bandwidth transferring unnecessary data
```

**GraphQL solution**:

```javascript
axios.post('/graphql', {
  query: `
    query {
      user(id: 123) {
        name
        email
      }
    }
  `
});

// Response: ONLY requested fields
{
  "data": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### **Under-Fetching**

**REST problem**:

```javascript
// Need user + their posts + post comments
// Requires 3+ requests

// 1. Get user
const user = await axios.get('/users/123');

// 2. Get user's posts
const posts = await axios.get(`/users/${user.data.id}/posts`);

// 3. Get comments for each post
const postsWithComments = await Promise.all(
  posts.data.map(async post => {
    const comments = await axios.get(`/posts/${post.id}/comments`);
    return { ...post, comments: comments.data };
  })
);

// Multiple round trips, waterfall requests, slow
```

**GraphQL solution**:

```javascript
// Single request with nested data
axios.post('/graphql', {
  query: `
    query {
      user(id: 123) {
        name
        posts {
          title
          comments {
            text
            author {
              name
            }
          }
        }
      }
    }
  `
});

// Response: All data in one request
{
  "data": {
    "user": {
      "name": "John Doe",
      "posts": [
        {
          "title": "Post 1",
          "comments": [
            { "text": "Great post!", "author": { "name": "Jane" } }
          ]
        }
      ]
    }
  }
}
```

### **Endpoint Proliferation**

**REST problem**:

```javascript
// Different data combinations require different endpoints
GET /users
GET /users/:id
GET /users/:id/posts
GET /users/:id/posts?include=comments
GET /users/:id/posts?include=comments,author
GET /users?filter[role]=admin&include=posts

// Dozens of endpoints for various needs
```

**GraphQL solution**:

```javascript
// Single endpoint, flexible queries
POST /graphql

// Query 1: Users with posts
query { users { name posts { title } } }

// Query 2: Users with posts and comments
query { users { name posts { title comments { text } } } }

// Query 3: Admin users with posts
query { users(role: ADMIN) { name posts { title } } }
```

### **Precise Data Fetching**

**GraphQL advantage**:

```javascript
// Mobile app: Needs minimal data
axios.post('/graphql', {
  query: `
    query {
      users {
        id
        name
      }
    }
  `
});

// Web app: Needs more data
axios.post('/graphql', {
  query: `
    query {
      users {
        id
        name
        email
        role
        avatar
        posts {
          title
        }
      }
    }
  `
});

// Same endpoint, different queries optimized per client
```

## Request Structure

### **POST to /graphql**

**Standard HTTP POST**:

```javascript
axios.post('https://api.example.com/graphql', {
  query: `
    query {
      user(id: 123) {
        name
      }
    }
  `
});

// Request headers
Content-Type: application/json
Authorization: Bearer <token>

// Request body
{
  "query": "query { user(id: 123) { name } }"
}
```

**GET support** (less common):

```javascript
// Some servers support GET for queries (not mutations)
axios.get('/graphql', {
  params: {
    query: 'query { user(id: 123) { name } }'
  }
});

// ⚠️ POST preferred (query complexity, cacheability, security)
```

### **Query String**

**Structured query**:

```javascript
const query = `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      posts {
        title
        publishedAt
      }
    }
  }
`;

axios.post('/graphql', { query });
```

**Multi-line vs single-line**:

```javascript
// Multi-line (readable)
const query = `
  query {
    user(id: 123) {
      name
      email
    }
  }
`;

// Single-line (compact)
const query = 'query { user(id: 123) { name email } }';

// Both valid
```

### **Variables**

**Parameterized queries**:

```javascript
// Query with variable placeholder
const query = `
  query GetUser($userId: ID!, $includeEmail: Boolean!) {
    user(id: $userId) {
      name
      email @include(if: $includeEmail)
    }
  }
`;

// Variables passed separately
axios.post('/graphql', {
  query: query,
  variables: {
    userId: 123,
    includeEmail: true
  }
});

// Benefits:
// - Type safety (variables validated against schema)
// - Reusability (same query, different variables)
// - Security (prevents injection via proper escaping)
```

**Variable types**:

```javascript
// Scalar types
query GetUser($id: ID!, $name: String!, $age: Int!, $active: Boolean!) {
  user(id: $id) { name }
}

// Object types
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
  }
}

// Variables
{
  "input": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}

// Array types
query GetUsers($ids: [ID!]!) {
  users(ids: $ids) {
    name
  }
}

// Variables
{
  "ids": [123, 456, 789]
}
```

### **Operation Name**

**Named operations**:

```javascript
// Named query
const query = `
  query GetUserWithPosts($id: ID!) {
    user(id: $id) {
      name
      posts {
        title
      }
    }
  }
`;

axios.post('/graphql', {
  query: query,
  variables: { id: 123 },
  operationName: 'GetUserWithPosts'
});

// Benefits:
// - Debugging (identify query in logs/traces)
// - Multiple operations (specify which to execute)
// - Documentation (self-describing queries)
```

**Multiple operations**:

```javascript
const query = `
  query GetUser($id: ID!) {
    user(id: $id) { name }
  }
  
  query GetPost($id: ID!) {
    post(id: $id) { title }
  }
`;

// Execute specific operation
axios.post('/graphql', {
  query: query,
  variables: { id: 123 },
  operationName: 'GetUser' // Which operation to run
});
```

## Response Structure

### **Data Field**

**Successful response**:

```javascript
// Request
axios.post('/graphql', {
  query: `
    query {
      user(id: 123) {
        name
        email
      }
    }
  `
});

// Response
{
  "data": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}

// Accessing data
const response = await axios.post('/graphql', { query });
const user = response.data.data.user;
console.log(user.name); // "John Doe"
```

**Shape matches query**:

```javascript
// Query structure
query {
  user(id: 123) {
    name
    posts {
      title
    }
  }
}

// Response structure (mirrors query)
{
  "data": {
    "user": {
      "name": "John Doe",
      "posts": [
        { "title": "Post 1" },
        { "title": "Post 2" }
      ]
    }
  }
}
```

### **Errors Array**

**Error response**:

```javascript
// Response with errors
{
  "data": null,
  "errors": [
    {
      "message": "User not found",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["user"],
      "extensions": {
        "code": "NOT_FOUND",
        "userId": 123
      }
    }
  ]
}

// Handling errors
const response = await axios.post('/graphql', { query });

if (response.data.errors) {
  response.data.errors.forEach(error => {
    console.error(`Error: ${error.message}`);
    console.error(`Path: ${error.path.join('.')}`);
  });
}
```

**Error structure**:

```javascript
{
  "message": "Human-readable error message",
  "locations": [
    { "line": 2, "column": 5 }
  ],
  "path": ["user", "posts", 0, "title"],
  "extensions": {
    "code": "INTERNAL_SERVER_ERROR",
    "exception": {
      "stacktrace": [...]
    }
  }
}
```

### **Null Handling**

**Partial success**:

```javascript
// Query
query {
  user(id: 123) {
    name
    invalidField  # Field doesn't exist
  }
}

// Response: data null, errors present
{
  "data": null,
  "errors": [
    {
      "message": "Cannot query field 'invalidField' on type 'User'"
    }
  ]
}
```

**Nullable fields**:

```javascript
// Schema
type User {
  name: String!      # Non-null
  email: String      # Nullable
  bio: String        # Nullable
}

// Query
query {
  user(id: 123) {
    name
    email
    bio
  }
}

// Response: null for nullable fields
{
  "data": {
    "user": {
      "name": "John Doe",
      "email": null,      # No email set
      "bio": null         # No bio set
    }
  }
}
```

### **Partial Responses**

**Errors for specific fields**:

```javascript
// Query multiple users
query {
  user1: user(id: 123) { name }
  user2: user(id: 456) { name }  # Doesn't exist
  user3: user(id: 789) { name }
}

// Response: partial data + errors
{
  "data": {
    "user1": { "name": "John" },
    "user2": null,                # Error for this field
    "user3": { "name": "Alice" }
  },
  "errors": [
    {
      "message": "User not found",
      "path": ["user2"]
    }
  ]
}
```

## Queries

### **Field Selection**

**Precise field selection**:

```javascript
// Select specific fields
axios.post('/graphql', {
  query: `
    query {
      user(id: 123) {
        name
        email
      }
    }
  `
});

// Response: Only selected fields
{
  "data": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### **Nested Queries**

**Traversing relationships**:

```javascript
// Nested data
axios.post('/graphql', {
  query: `
    query {
      user(id: 123) {
        name
        posts {
          title
          comments {
            text
            author {
              name
            }
          }
        }
      }
    }
  `
});

// Response: Nested structure
{
  "data": {
    "user": {
      "name": "John Doe",
      "posts": [
        {
          "title": "GraphQL Tutorial",
          "comments": [
            {
              "text": "Great post!",
              "author": { "name": "Jane" }
            }
          ]
        }
      ]
    }
  }
}
```

### **Arguments**

**Filtering/pagination**:

```javascript
// Arguments on fields
axios.post('/graphql', {
  query: `
    query {
      users(limit: 10, offset: 0, role: ADMIN) {
        name
        email
      }
      
      posts(first: 5, orderBy: CREATED_AT_DESC) {
        title
        publishedAt
      }
    }
  `
});

// With variables
axios.post('/graphql', {
  query: `
    query GetUsers($limit: Int!, $role: Role!) {
      users(limit: $limit, role: $role) {
        name
      }
    }
  `,
  variables: {
    limit: 10,
    role: 'ADMIN'
  }
});
```

### **Aliases**

**Renaming fields**:

```javascript
// Query same field with different arguments
axios.post('/graphql', {
  query: `
    query {
      adminUsers: users(role: ADMIN) {
        name
      }
      editorUsers: users(role: EDITOR) {
        name
      }
    }
  `
});

// Response: Aliased fields
{
  "data": {
    "adminUsers": [
      { "name": "John" }
    ],
    "editorUsers": [
      { "name": "Jane" }
    ]
  }
}
```

## Mutations

### **Create Operations**

**Creating resources**:

```javascript
// Mutation
axios.post('/graphql', {
  query: `
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        name
        email
        createdAt
      }
    }
  `,
  variables: {
    input: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'EDITOR'
    }
  }
});

// Response
{
  "data": {
    "createUser": {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-11-17T10:00:00Z"
    }
  }
}
```

### **Update Operations**

**Modifying resources**:

```javascript
axios.post('/graphql', {
  query: `
    mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
      updateUser(id: $id, input: $input) {
        id
        name
        email
        updatedAt
      }
    }
  `,
  variables: {
    id: '123',
    input: {
      name: 'John Smith'
    }
  }
});
```

### **Delete Operations**

**Removing resources**:

```javascript
axios.post('/graphql', {
  query: `
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id)
    }
  `,
  variables: {
    id: '123'
  }
});

// Response
{
  "data": {
    "deleteUser": true
  }
}
```

### **Input Types**

**Complex input objects**:

```javascript
// Schema
input CreatePostInput {
  title: String!
  content: String!
  authorId: ID!
  tags: [String!]!
  published: Boolean!
}

// Mutation
axios.post('/graphql', {
  query: `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        id
        title
      }
    }
  `,
  variables: {
    input: {
      title: 'GraphQL Guide',
      content: 'Long content...',
      authorId: '123',
      tags: ['graphql', 'api'],
      published: true
    }
  }
});
```

## Axios Integration

### **Basic Queries**

**Simple wrapper**:

```javascript
async function graphqlQuery(query, variables = {}) {
  const response = await axios.post('/graphql', {
    query,
    variables
  });
  
  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }
  
  return response.data.data;
}

// Usage
const user = await graphqlQuery(`
  query {
    user(id: 123) {
      name
      email
    }
  }
`);

console.log(user.user.name);
```

### **Variables**

**Type-safe variables**:

```javascript
async function getUser(userId) {
  return graphqlQuery(
    `
      query GetUser($id: ID!) {
        user(id: $id) {
          name
          email
        }
      }
    `,
    { id: userId }
  );
}

const user = await getUser(123);
```

### **Error Handling**

**Comprehensive error handling**:

```javascript
async function graphqlQuery(query, variables = {}) {
  try {
    const response = await axios.post('/graphql', {
      query,
      variables
    });
    
    // Check for GraphQL errors
    if (response.data.errors) {
      const errors = response.data.errors.map(e => e.message).join(', ');
      throw new Error(`GraphQL Error: ${errors}`);
    }
    
    return response.data.data;
  } catch (error) {
    // HTTP error
    if (error.response) {
      throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
    }
    
    // Network error
    if (error.request) {
      throw new Error('Network error: No response from server');
    }
    
    // Other error
    throw error;
  }
}
```

### **Response Typing**

**TypeScript integration**:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    path?: string[];
  }>;
}

async function graphqlQuery<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const response = await axios.post<GraphQLResponse<T>>('/graphql', {
    query,
    variables
  });
  
  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }
  
  return response.data.data;
}

// Usage with type inference
const data = await graphqlQuery<{ user: User }>(
  `query { user(id: 123) { id name email } }`
);

const user: User = data.user;
```

## Advanced Patterns

### **Fragments**

**Reusable field sets**:

```javascript
const USER_FRAGMENT = `
  fragment UserFields on User {
    id
    name
    email
    role
  }
`;

// Use in queries
axios.post('/graphql', {
  query: `
    ${USER_FRAGMENT}
    
    query {
      user(id: 123) {
        ...UserFields
        posts {
          title
        }
      }
    }
  `
});

// Multiple fragments
const POST_FRAGMENT = `
  fragment PostFields on Post {
    id
    title
    content
    publishedAt
  }
`;

axios.post('/graphql', {
  query: `
    ${USER_FRAGMENT}
    ${POST_FRAGMENT}
    
    query {
      user(id: 123) {
        ...UserFields
        posts {
          ...PostFields
        }
      }
    }
  `
});
```

### **Directives**

**Conditional inclusion**:

```javascript
// @include directive
axios.post('/graphql', {
  query: `
    query GetUser($id: ID!, $includeEmail: Boolean!) {
      user(id: $id) {
        name
        email @include(if: $includeEmail)
      }
    }
  `,
  variables: {
    id: 123,
    includeEmail: true
  }
});

// @skip directive
axios.post('/graphql', {
  query: `
    query GetUser($id: ID!, $skipPosts: Boolean!) {
      user(id: $id) {
        name
        posts @skip(if: $skipPosts) {
          title
        }
      }
    }
  `,
  variables: {
    id: 123,
    skipPosts: false
  }
});
```

### **Batch Requests**

**Multiple queries in one request**:

```javascript
// Array of requests
axios.post('/graphql', [
  {
    query: 'query { user(id: 123) { name } }'
  },
  {
    query: 'query { posts(limit: 10) { title } }'
  }
]);

// Response: Array of responses
[
  { "data": { "user": { "name": "John" } } },
  { "data": { "posts": [{ "title": "Post 1" }] } }
]

// ⚠️ Requires server support (not standard GraphQL)
```

---

# 🎯 Aplicabilidade

## When to Use Axios for GraphQL

**Simple scenarios**: Few GraphQL queries, prototyping/learning, existing Axios infrastructure, lightweight requirements.

**Raw Axios advantages**: Minimal bundle size, full control over requests/responses, leverage existing interceptors/config, no additional dependencies.

## When to Use Dedicated Client

**Complex applications**: Many queries/mutations, normalized caching needed, optimistic updates, real-time subscriptions.

**Apollo/urql advantages**: Normalized cache (automatic data consistency), React hooks (useQuery, useMutation), DevTools, code generation, battle-tested.

---

# ⚠️ Limitações

## Caching Complexity

REST benefits from HTTP caching (GET requests cached by browsers/CDNs). GraphQL POST requests não automatically cached.

**Solution**: Implement custom caching (Apollo normalized cache, urql default cache), use GET for queries if server supports.

## N+1 Problem

Naive GraphQL implementations may execute database query per item (e.g., fetching author for each post).

**Solution**: DataLoader batching/caching, server-side optimization.

## File Uploads

GraphQL não natively support file uploads (spec defines JSON only).

**Solution**: Multipart spec, base64 encoding, separate REST endpoint for uploads.

---

# 🔗 Interconexões

## REST Comparison

GraphQL addresses REST over-fetching/under-fetching (M16-01 RESTful client comparison).

## Error Handling

GraphQL errors require checking both HTTP errors AND errors array (M4-response-error patterns).

## TypeScript Integration

Type-safe GraphQL queries via TypeScript (M13-typescript generic types).

---

# 🚀 Evolução

## GraphQL Code Generation

Tools like GraphQL Code Generator automatically generating TypeScript types from schema.

## Federation

GraphQL Federation enabling microservices architecture (multiple GraphQL services composed into single schema).

## Subscriptions

Real-time updates via WebSocket (beyond HTTP/Axios scope).

---

**Conclusão Integrada**: GraphQL integration via Axios enables consuming GraphQL APIs without full-featured client overhead: **fundamentals** (single `/graphql` endpoint handling all queries/mutations via POST, query language specifying exact fields needed eliminating over-fetching, strong type system validating queries against schema, introspection enabling automatic documentation/tooling), **advantages over REST** (over-fetching eliminated requesting only needed fields `{ user { name email } }` instead all fields, under-fetching eliminated via nested queries fetching user+posts+comments em single request avoiding waterfall, endpoint proliferation eliminated via flexible queries to single endpoint, precise data fetching optimizing different clients mobile/web from same endpoint), **request structure** (POST to `/graphql` with JSON body containing `query` string, `variables` object for parameterization, optional `operationName` for debugging/multiple operations), **response structure** (`data` field containing requested data matching query shape, `errors` array with GraphQL errors message/locations/path, null handling for partial responses, both data and errors may coexist for partial success), **queries** (field selection requesting specific fields, nested queries traversing relationships `user { posts { comments } }`, arguments for filtering/pagination `users(limit: 10, role: ADMIN)`, aliases renaming fields `adminUsers: users(role: ADMIN)`), **mutations** (create via `mutation { createUser(input: { name }) { id } }`, update via `updateUser(id, input)`, delete via `deleteUser(id)`, input types for complex object parameters), **Axios integration** (basic wrapper `axios.post('/graphql', { query, variables })` extracting `response.data.data`, variable passing via separate `variables` object type-safe, error handling checking both `response.data.errors` GraphQL errors AND HTTP errors, TypeScript typing via `GraphQLResponse<T>` interface ensuring type safety), **query builder** (programmatic construction via template literals, reusable query functions `getUser(id)` encapsulating queries, type-safe via TypeScript generics `graphqlQuery<{ user: User }>()`), **advanced patterns** (fragments defining reusable field sets `fragment UserFields on User { id name }`, directives `@include(if: $var)` and `@skip(if: $var)` for conditional fields, batch requests sending multiple queries em single HTTP request when server supports). Choosing between raw Axios versus dedicated client: **use Axios when** simple queries few GraphQL requests, prototyping/learning GraphQL basics, existing Axios infrastructure interceptors/config to leverage, lightweight requirements avoiding bundle size (Apollo ~50KB vs Axios minimal); **use Apollo/urql when** complex applications with many queries/mutations, normalized caching needed for automatic data consistency across components, optimistic updates required immediate UI feedback before server response, real-time subscriptions via WebSocket, developer experience benefits like React hooks useQuery/useMutation, code generation from schema, comprehensive DevTools, battle-tested production libraries. GraphQL solving fundamental REST limitations: over-fetching REST `GET /users` returning all fields when only name needed wasting bandwidth, GraphQL requesting exact fields `{ user { name } }` optimized; under-fetching REST requiring multiple requests `GET /users/123` then `GET /users/123/posts` waterfall slow, GraphQL single nested query `{ user { name posts { title } } }` fast; endpoint proliferation REST needing dozens endpoints for combinations, GraphQL single endpoint flexible queries. Critical understanding: GraphQL queries via Axios use standard HTTP POST to `/graphql` endpoint with JSON body, response contains `data` matching query shape and optional `errors` array, proper error handling checks both for robustness, TypeScript integration providing compile-time safety for query results, fragments enable code reuse across queries, variables provide type-safe parameterization preventing injection, dedicated clients (Apollo/urql) offer advanced features mas Axios sufficient for simpler use cases prioritizing minimal dependencies/bundle size.