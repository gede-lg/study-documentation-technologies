# 🎯 Introdução

**Pagination, Filtering, Sorting** em Axios envolve implementing efficient data retrieval patterns (**offset-based pagination**, **cursor-based pagination**, **page-based pagination**, **query parameter construction**), filtering resources by attributes (search, status, date ranges), sorting results by fields (ascending/descending, multiple fields), handling large datasets without overwhelming client/server, optimizing performance via limit/offset, managing state (current page, filters, sort order), implementing infinite scroll versus traditional pagination.

O problema fundamental de data retrieval: APIs often expose **large datasets** (thousands/millions of users, posts, products); fetching all records em single request causes **performance issues** (massive response size overwhelming network/memory, slow server processing querying entire database, poor UX waiting for huge payload), **scalability problems** (server cannot handle concurrent requests for full datasets), **usability challenges** (displaying thousands of items overwhelming users).

Pagination fundamentals: **Dividing data into pages** (limit results per request), **Client controls page** (requesting specific page/offset), **Server returns subset** (e.g., 10 items instead of 10,000), **Metadata included** (total count, current page, total pages, next/previous links), **Improved performance** (smaller payloads, faster queries, better UX).

Pagination strategies comparison:

**Offset-based** (`?offset=20&limit=10`): Simple, supports random access (jump to page 5), suitable for static data. Limitations: poor performance em large offsets (database skips many rows), inconsistent results if data changes during pagination (new items shift pages).

**Cursor-based** (`?after=cursor123&limit=10`): Efficient for large datasets, consistent results even with data changes, ideal for infinite scroll. Limitations: no random access (cannot jump to page 5), more complex implementation.

**Page-based** (`?page=3&limit=10`): Most common, user-friendly (page numbers), simple implementation. Limitations: same offset-based issues (performance degradation, inconsistency with data changes).

Filtering fundamentals: **Narrowing results** by criteria (status=active, role=admin, created_after=2025-01-01), **Query parameters** (key-value pairs `?status=active&role=admin`), **Search** (full-text or partial matching `?search=john`), **Date ranges** (`?start_date=2025-01-01&end_date=2025-12-31`), **Multiple filters** combinable (`?status=active&role=admin&search=john`).

Common filter patterns:

**Exact match** (`?status=active`): Field equals specific value.

**Partial match** (`?name_contains=john`): Field contains substring (case-insensitive search).

**Range** (`?price_min=10&price_max=100`): Value within range.

**In list** (`?role=admin,editor`): Value matches any from list.

**Boolean** (`?is_active=true`): True/false filtering.

Sorting fundamentals: **Ordering results** by field (name, created_at, price), **Direction** (ascending `asc` or descending `desc`), **Multiple fields** (sort by name ascending, then created_at descending), **Default sort** (server-defined when client doesn't specify).

Sort parameter formats:

**Simple** (`?sort=name`): Single field, default direction.

**With direction** (`?sort=name&order=asc`): Explicit direction.

**Combined** (`?sort=name:asc`): Field and direction together.

**Multiple fields** (`?sort=name:asc,created_at:desc`): Comma-separated.

Axios implementation patterns: **Query parameters** via `params` option (automatic URL encoding), **State management** (tracking current page/filters/sort), **Response metadata** (extracting total/page from response), **URL synchronization** (reflecting state em URL for bookmarking/sharing), **Loading states** (pending, success, error), **Debouncing** (search input delaying requests).

Real-world example:

```javascript
// GET /users?page=2&limit=10&status=active&role=admin&sort=name:asc
axios.get('/users', {
  params: {
    page: 2,
    limit: 10,
    status: 'active',
    role: 'admin',
    sort: 'name:asc'
  }
});

// Response
{
  "data": [
    { "id": 11, "name": "Alice", "status": "active", "role": "admin" },
    { "id": 12, "name": "Bob", "status": "active", "role": "admin" }
  ],
  "meta": {
    "total": 100,
    "page": 2,
    "limit": 10,
    "totalPages": 10
  },
  "links": {
    "first": "/users?page=1&limit=10",
    "prev": "/users?page=1&limit=10",
    "next": "/users?page=3&limit=10",
    "last": "/users?page=10&limit=10"
  }
}
```

Advanced patterns incluem: **Filter builder** (constructing complex filter objects), **Saved filters** (preset filter combinations), **Dynamic sorting** (clicking column headers toggling sort direction), **Infinite scroll** (loading more items on scroll), **Virtual scrolling** (rendering only visible items from large datasets), **Server-side search** (delegating search to backend instead client filtering).

Performance considerations: **Limit page size** (balance UX with performance - typically 10-50 items), **Index database fields** (ensure sort/filter fields indexed for fast queries), **Cache results** (avoid redundant requests for same page), **Prefetch next page** (load page N+1 while user views page N), **Debounce search** (wait for user to stop typing before requesting).

Common challenges: **Inconsistent results** (offset-based pagination with data changes - cursor-based solution), **Total count performance** (`COUNT(*)` expensive on large tables - estimate or omit), **Complex filters** (many parameters making URLs long - POST with filter body), **Filter validation** (ensuring valid filter combinations - server-side validation), **URL length limits** (browsers limit URL length - use POST for complex queries).

Best practices incluem: **Consistent parameter names** (page/limit/offset/sort across API), **Validate inputs** (page > 0, limit reasonable range 1-100), **Return metadata** (total, current page, total pages enabling UI controls), **Support multiple formats** (offset, cursor, page-based para different use cases), **Document filters** (API documentation listing available filters/operators), **Default values** (sensible defaults when client omits parameters).

Este módulo explora comprehensive pagination/filtering/sorting implementation: desde core concepts (pagination strategies offset/cursor/page-based, filter patterns exact/partial/range, sort directions ascending/descending), através de implementation techniques (query parameter construction, state management, response parsing), até advanced topics (infinite scroll, debouncing, performance optimization). Objetivo é fornecer complete understanding para implementing efficient data retrieval em production Axios applications.

---

# 📋 Sumário

### **Pagination Fundamentals**
- Why paginate
- Performance benefits
- UX improvements
- Metadata structure

### **Pagination Strategies**
- Offset-based
- Cursor-based
- Page-based
- Comparison

### **Offset Pagination**
- Limit and offset
- Random access
- Performance issues
- Implementation

### **Cursor Pagination**
- After/before cursors
- Consistency
- Infinite scroll
- Implementation

### **Page Pagination**
- Page numbers
- User-friendly
- Common pattern
- Implementation

### **Filtering**
- Exact match
- Partial match
- Range filters
- Multiple filters

### **Search**
- Full-text search
- Partial matching
- Debouncing
- Backend delegation

### **Sorting**
- Single field
- Multiple fields
- Direction control
- Default sorting

### **Axios Implementation**
- Query parameters
- State management
- Response parsing
- URL synchronization

### **Advanced Patterns**
- Infinite scroll
- Virtual scrolling
- Filter builder
- Prefetching

---

# 🧠 Fundamentos

## Pagination Fundamentals

### **Why Paginate**

**Problem: Large datasets**:

```javascript
// ❌ Fetching all users (10,000 records)
const response = await axios.get('/users');
// Response: 5MB JSON, 10 seconds to load
// Browser: Memory spike, UI freeze
// Server: Slow query, high CPU

// ✅ Paginated (10 records)
const response = await axios.get('/users', {
  params: { page: 1, limit: 10 }
});
// Response: 5KB JSON, <1 second
// Browser: Smooth, responsive
// Server: Fast query, indexed lookup
```

**Scalability**:

| Request Type | Records | Response Size | Query Time | Network Time |
|--------------|---------|---------------|------------|--------------|
| No pagination| 10,000  | 5MB          | 10s        | 15s          |
| Paginated    | 10      | 5KB          | 0.1s       | 0.2s         |

### **Performance Benefits**

**Server-side**:
- Smaller queries (LIMIT clause reduces rows scanned)
- Indexed lookups (WHERE + LIMIT optimized)
- Lower memory usage (processing fewer records)
- Concurrent requests (server handles more clients)

**Client-side**:
- Faster rendering (fewer DOM elements)
- Lower memory (smaller data structures)
- Responsive UI (no freezing during load)
- Progressive loading (show first page immediately)

**Network**:
- Smaller payloads (reduced bandwidth)
- Faster transfers (less data over wire)
- Better mobile experience (cellular data savings)

### **UX Improvements**

**User benefits**:
- Immediate feedback (first page loads quickly)
- Manageable content (10-20 items easier to scan than 10,000)
- Navigation (page numbers, next/previous buttons)
- Loading indicators (clear feedback during pagination)

**Patterns**:

```javascript
// Traditional pagination (page numbers)
[1] [2] [3] [4] [5] ... [100]

// Infinite scroll (load more on scroll)
[Items 1-10]
[Items 11-20] <- Loaded automatically
[Items 21-30] <- Loading...

// Load more button
[Items 1-10]
[Load More] <- Click to fetch next page
```

### **Metadata Structure**

**Standard response format**:

```javascript
{
  "data": [...],           // Actual items
  "meta": {
    "total": 1000,         // Total items across all pages
    "page": 2,             // Current page
    "limit": 10,           // Items per page
    "totalPages": 100      // Total pages
  },
  "links": {
    "first": "/users?page=1",
    "prev": "/users?page=1",
    "next": "/users?page=3",
    "last": "/users?page=100"
  }
}
```

**Extracting metadata**:

```javascript
const response = await axios.get('/users', {
  params: { page: 2, limit: 10 }
});

const users = response.data.data;
const total = response.data.meta.total;
const currentPage = response.data.meta.page;
const totalPages = response.data.meta.totalPages;

console.log(`Showing page ${currentPage} of ${totalPages}`);
console.log(`Total users: ${total}`);
```

## Pagination Strategies

### **Offset-Based**

**Concept**: Skip N records, return M records.

```javascript
// Page 1: offset=0, limit=10 (records 1-10)
GET /users?offset=0&limit=10

// Page 2: offset=10, limit=10 (records 11-20)
GET /users?offset=10&limit=10

// Page 3: offset=20, limit=10 (records 21-30)
GET /users?offset=20&limit=10
```

**SQL equivalent**:

```sql
-- offset=20, limit=10
SELECT * FROM users LIMIT 10 OFFSET 20;
```

**Pros**:
- ✅ Simple implementation
- ✅ Random access (jump to any page)
- ✅ Known total pages

**Cons**:
- ❌ Performance degrades with large offsets (OFFSET 10000 slow)
- ❌ Inconsistent results (if data changes during pagination)

**When to use**: Small-medium datasets, random page access needed, data relatively static.

### **Cursor-Based**

**Concept**: Use cursor (unique identifier) to fetch next/previous page.

```javascript
// First page: No cursor
GET /users?limit=10

// Response includes cursor for next page
{
  "data": [...],
  "cursor": {
    "next": "eyJpZCI6MTB9", // Encoded cursor (e.g., last item ID)
    "prev": null
  }
}

// Next page: Use cursor
GET /users?after=eyJpZCI6MTB9&limit=10
```

**SQL equivalent**:

```sql
-- after cursor (decoded to id=10)
SELECT * FROM users WHERE id > 10 ORDER BY id LIMIT 10;
```

**Pros**:
- ✅ Efficient for large datasets (indexed WHERE clause)
- ✅ Consistent results (stable even with data changes)
- ✅ Ideal for infinite scroll

**Cons**:
- ❌ No random access (cannot jump to page 5)
- ❌ Complex implementation
- ❌ Unknown total pages

**When to use**: Large datasets, infinite scroll, real-time data (frequent inserts/deletes).

### **Page-Based**

**Concept**: Request specific page number.

```javascript
// Page 1
GET /users?page=1&limit=10

// Page 2
GET /users?page=2&limit=10

// Page 5
GET /users?page=5&limit=10
```

**Conversion to offset**:

```javascript
const page = 3;
const limit = 10;
const offset = (page - 1) * limit; // 20

// Internally: SELECT * FROM users LIMIT 10 OFFSET 20
```

**Pros**:
- ✅ User-friendly (page numbers)
- ✅ Simple implementation
- ✅ Random access

**Cons**:
- ❌ Same as offset-based (performance, inconsistency)

**When to use**: Most common pattern, user expects page numbers, traditional pagination UI.

### **Comparison**

| Strategy     | Random Access | Performance | Consistency | Complexity | Total Count |
|--------------|---------------|-------------|-------------|------------|-------------|
| Offset-based | ✅ Yes       | ⚠️ Degrades | ❌ No      | ✅ Simple  | ✅ Yes     |
| Cursor-based | ❌ No        | ✅ Fast     | ✅ Yes     | ⚠️ Complex | ❌ No      |
| Page-based   | ✅ Yes       | ⚠️ Degrades | ❌ No      | ✅ Simple  | ✅ Yes     |

## Offset Pagination

### **Limit and Offset**

**Basic implementation**:

```javascript
async function getUsers(offset = 0, limit = 10) {
  const response = await axios.get('/users', {
    params: { offset, limit }
  });
  
  return response.data;
}

// Get first page
const page1 = await getUsers(0, 10);

// Get second page
const page2 = await getUsers(10, 10);

// Get third page
const page3 = await getUsers(20, 10);
```

**Calculating offset from page**:

```javascript
function getPageOffset(page, limit) {
  return (page - 1) * limit;
}

async function getUsersByPage(page = 1, limit = 10) {
  const offset = getPageOffset(page, limit);
  
  const response = await axios.get('/users', {
    params: { offset, limit }
  });
  
  return response.data;
}

// Get page 5 (offset = 40)
const page5 = await getUsersByPage(5, 10);
```

### **Random Access**

**Jump to any page**:

```javascript
// State
const [currentPage, setCurrentPage] = useState(1);
const [users, setUsers] = useState([]);

// Load specific page
async function loadPage(page) {
  const data = await getUsersByPage(page, 10);
  setUsers(data.data);
  setCurrentPage(page);
}

// Jump to page 5
loadPage(5);

// Jump to page 10
loadPage(10);

// Jump to last page
const totalPages = Math.ceil(total / limit);
loadPage(totalPages);
```

### **Performance Issues**

**Large offset problem**:

```javascript
// Page 1: Fast (OFFSET 0)
GET /users?offset=0&limit=10
// Query: SELECT * FROM users LIMIT 10 OFFSET 0
// Time: 10ms

// Page 100: Slow (OFFSET 990)
GET /users?offset=990&limit=10
// Query: SELECT * FROM users LIMIT 10 OFFSET 990
// Time: 200ms (database scans 990 rows to skip)

// Page 1000: Very slow (OFFSET 9990)
GET /users?offset=9990&limit=10
// Query: SELECT * FROM users LIMIT 10 OFFSET 9990
// Time: 2000ms (scans 9990 rows!)
```

**Solution**: Use cursor-based pagination para large datasets, or limit maximum page number.

### **Implementation**

**Complete example**:

```javascript
// State
const [users, setUsers] = useState([]);
const [page, setPage] = useState(1);
const [total, setTotal] = useState(0);
const [loading, setLoading] = useState(false);

const limit = 10;

// Load page
async function loadPage(pageNumber) {
  setLoading(true);
  
  try {
    const offset = (pageNumber - 1) * limit;
    
    const response = await axios.get('/users', {
      params: { offset, limit }
    });
    
    setUsers(response.data.data);
    setTotal(response.data.meta.total);
    setPage(pageNumber);
  } catch (error) {
    console.error('Failed to load users:', error);
  } finally {
    setLoading(false);
  }
}

// Navigation
function nextPage() {
  const totalPages = Math.ceil(total / limit);
  if (page < totalPages) {
    loadPage(page + 1);
  }
}

function prevPage() {
  if (page > 1) {
    loadPage(page - 1);
  }
}

function goToPage(pageNumber) {
  loadPage(pageNumber);
}

// Initial load
useEffect(() => {
  loadPage(1);
}, []);
```

## Cursor Pagination

### **After/Before Cursors**

**Concept**: Use last item's ID/timestamp as cursor.

```javascript
// First page (no cursor)
GET /users?limit=10

// Response
{
  "data": [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" },
    // ...
    { "id": 10, "name": "John" }
  ],
  "cursor": {
    "next": "10",  // Last item ID
    "prev": null
  }
}

// Next page (after cursor 10)
GET /users?after=10&limit=10

// Response
{
  "data": [
    { "id": 11, "name": "Jane" },
    { "id": 12, "name": "Mike" },
    // ...
    { "id": 20, "name": "Sarah" }
  ],
  "cursor": {
    "next": "20",
    "prev": "11"
  }
}
```

**Server-side implementation**:

```sql
-- First page
SELECT * FROM users ORDER BY id LIMIT 10;

-- After cursor 10
SELECT * FROM users WHERE id > 10 ORDER BY id LIMIT 10;

-- Before cursor 11 (previous page)
SELECT * FROM users WHERE id < 11 ORDER BY id DESC LIMIT 10;
```

### **Consistency**

**Stable results with data changes**:

```javascript
// Offset-based problem
// Page 1: Users 1-10
GET /users?offset=0&limit=10

// New user inserted at position 1 (shifts all users)

// Page 2: Users 11-20 (BUT user 10 appears again!)
GET /users?offset=10&limit=10
// Returns user 10 (shifted) + users 11-19

// Cursor-based solution
// Page 1: Users 1-10, cursor=10
GET /users?limit=10

// New user inserted at position 1 (doesn't affect next page)

// Page 2: Users 11-20 (correct!)
GET /users?after=10&limit=10
// Returns users 11-20 (consistent)
```

### **Infinite Scroll**

**Loading more items**:

```javascript
const [users, setUsers] = useState([]);
const [cursor, setCursor] = useState(null);
const [hasMore, setHasMore] = useState(true);

async function loadMore() {
  const params = { limit: 10 };
  if (cursor) {
    params.after = cursor;
  }
  
  const response = await axios.get('/users', { params });
  
  // Append new items
  setUsers(prev => [...prev, ...response.data.data]);
  
  // Update cursor
  setCursor(response.data.cursor.next);
  
  // Check if more items exist
  setHasMore(response.data.cursor.next !== null);
}

// Initial load
useEffect(() => {
  loadMore();
}, []);

// Scroll event
function handleScroll() {
  const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
  
  if (bottom && hasMore && !loading) {
    loadMore();
  }
}

useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [hasMore, loading]);
```

### **Implementation**

**Complete example**:

```javascript
const [items, setItems] = useState([]);
const [cursor, setCursor] = useState(null);
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);

async function loadNextPage() {
  if (!hasMore || loading) return;
  
  setLoading(true);
  
  try {
    const response = await axios.get('/users', {
      params: {
        after: cursor,
        limit: 20
      }
    });
    
    const newItems = response.data.data;
    const nextCursor = response.data.cursor?.next;
    
    setItems(prev => [...prev, ...newItems]);
    setCursor(nextCursor);
    setHasMore(nextCursor !== null);
  } catch (error) {
    console.error('Failed to load more:', error);
  } finally {
    setLoading(false);
  }
}

// Infinite scroll
const observer = useRef();
const lastItemRef = useCallback(node => {
  if (loading) return;
  if (observer.current) observer.current.disconnect();
  
  observer.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore) {
      loadNextPage();
    }
  });
  
  if (node) observer.current.observe(node);
}, [loading, hasMore]);

// Render
return (
  <div>
    {items.map((item, index) => {
      const isLast = index === items.length - 1;
      return (
        <div ref={isLast ? lastItemRef : null} key={item.id}>
          {item.name}
        </div>
      );
    })}
    {loading && <div>Loading...</div>}
  </div>
);
```

## Page Pagination

### **Page Numbers**

**User-friendly interface**:

```javascript
async function getUsersByPage(page = 1, limit = 10) {
  const response = await axios.get('/users', {
    params: { page, limit }
  });
  
  return response.data;
}

// Page controls
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div>
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          className={page === currentPage ? 'active' : ''}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
```

### **Common Pattern**

**Standard implementation**:

```javascript
const [users, setUsers] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const limit = 10;

async function loadPage(pageNumber) {
  const response = await axios.get('/users', {
    params: { page: pageNumber, limit }
  });
  
  setUsers(response.data.data);
  setTotalPages(response.data.meta.totalPages);
  setPage(pageNumber);
}

// URL synchronization
const navigate = useNavigate();
const location = useLocation();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const urlPage = parseInt(params.get('page')) || 1;
  loadPage(urlPage);
}, [location.search]);

function changePage(newPage) {
  navigate(`?page=${newPage}`);
}
```

## Filtering

### **Exact Match**

**Single filter**:

```javascript
// Filter by status
axios.get('/users', {
  params: { status: 'active' }
});
// → GET /users?status=active

// Filter by role
axios.get('/users', {
  params: { role: 'admin' }
});
// → GET /users?role=admin
```

**Multiple filters**:

```javascript
axios.get('/users', {
  params: {
    status: 'active',
    role: 'admin',
    verified: true
  }
});
// → GET /users?status=active&role=admin&verified=true
```

### **Partial Match**

**Search/contains**:

```javascript
// Name contains "john"
axios.get('/users', {
  params: { search: 'john' }
});
// Server: WHERE name LIKE '%john%'

// Email contains "@example.com"
axios.get('/users', {
  params: { email_contains: '@example.com' }
});
```

### **Range Filters**

**Numeric ranges**:

```javascript
// Price between 10 and 100
axios.get('/products', {
  params: {
    price_min: 10,
    price_max: 100
  }
});

// Age greater than 18
axios.get('/users', {
  params: { age_gte: 18 }
});
```

**Date ranges**:

```javascript
// Created between dates
axios.get('/posts', {
  params: {
    created_after: '2025-01-01',
    created_before: '2025-12-31'
  }
});
```

### **Multiple Filters**

**Combining filters**:

```javascript
const filters = {
  status: 'active',
  role: 'admin',
  created_after: '2025-01-01',
  search: 'john'
};

axios.get('/users', { params: filters });
// → GET /users?status=active&role=admin&created_after=2025-01-01&search=john
```

**Filter builder**:

```javascript
class FilterBuilder {
  constructor() {
    this.filters = {};
  }
  
  where(field, value) {
    this.filters[field] = value;
    return this;
  }
  
  search(query) {
    this.filters.search = query;
    return this;
  }
  
  range(field, min, max) {
    this.filters[`${field}_min`] = min;
    this.filters[`${field}_max`] = max;
    return this;
  }
  
  build() {
    return this.filters;
  }
}

// Usage
const filters = new FilterBuilder()
  .where('status', 'active')
  .where('role', 'admin')
  .search('john')
  .range('age', 18, 65)
  .build();

axios.get('/users', { params: filters });
```

## Search

### **Full-Text Search**

**Backend search**:

```javascript
const [searchQuery, setSearchQuery] = useState('');
const [results, setResults] = useState([]);

async function search(query) {
  const response = await axios.get('/users/search', {
    params: { q: query }
  });
  
  setResults(response.data.data);
}

// Triggered on input change (with debounce)
function handleSearchChange(e) {
  const query = e.target.value;
  setSearchQuery(query);
  debouncedSearch(query);
}
```

### **Debouncing**

**Avoid excessive requests**:

```javascript
import { debounce } from 'lodash';

// Debounce search (wait 300ms after user stops typing)
const debouncedSearch = useCallback(
  debounce(async (query) => {
    if (query.length < 3) return; // Minimum 3 characters
    
    const response = await axios.get('/users/search', {
      params: { q: query }
    });
    
    setResults(response.data.data);
  }, 300),
  []
);

// Input component
<input
  type="text"
  value={searchQuery}
  onChange={handleSearchChange}
  placeholder="Search users..."
/>
```

**Manual debounce**:

```javascript
const [searchQuery, setSearchQuery] = useState('');
const timeoutRef = useRef(null);

function handleSearchChange(e) {
  const query = e.target.value;
  setSearchQuery(query);
  
  // Clear previous timeout
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  
  // Set new timeout
  timeoutRef.current = setTimeout(() => {
    if (query.length >= 3) {
      search(query);
    }
  }, 300);
}
```

## Sorting

### **Single Field**

**Basic sorting**:

```javascript
// Sort by name (ascending)
axios.get('/users', {
  params: { sort: 'name' }
});

// Sort by name (descending)
axios.get('/users', {
  params: { sort: '-name' }
});
// OR
axios.get('/users', {
  params: { sort: 'name', order: 'desc' }
});
```

### **Multiple Fields**

**Multi-level sorting**:

```javascript
// Sort by role (asc), then name (asc)
axios.get('/users', {
  params: { sort: 'role,name' }
});

// Sort by role (asc), then created_at (desc)
axios.get('/users', {
  params: { sort: 'role,-created_at' }
});
```

### **Direction Control**

**Toggling sort direction**:

```javascript
const [sortField, setSortField] = useState('name');
const [sortOrder, setSortOrder] = useState('asc');

function toggleSort(field) {
  if (sortField === field) {
    // Same field: toggle direction
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  } else {
    // Different field: default ascending
    setSortField(field);
    setSortOrder('asc');
  }
}

// Load users with current sort
async function loadUsers() {
  const response = await axios.get('/users', {
    params: {
      sort: sortField,
      order: sortOrder
    }
  });
  
  setUsers(response.data.data);
}

// Table header
<th onClick={() => toggleSort('name')}>
  Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
</th>
```

---

# 🎯 Aplicabilidade

## When to Use Each Strategy

**Offset/Page**: Small-medium datasets (<100K records), user expects page numbers, random access needed.

**Cursor**: Large datasets (>100K records), infinite scroll, real-time data with frequent changes.

**Filtering**: Narrowing large result sets, search functionality, multi-criteria selection.

**Sorting**: Organizing results logically, user-controlled ordering, prioritizing items.

## Performance Optimization

**Database**: Index sort/filter fields, limit page size (10-50 items), cache total counts, use covering indexes.

**Network**: Debounce search (300ms), prefetch next page, cache responses, compress payloads.

**UI**: Virtual scrolling for large lists, loading skeletons, optimistic updates, infinite scroll for mobile.

---

# ⚠️ Limitações

## Offset Performance Degradation

Large offsets slow (OFFSET 10000 scans 10,000 rows).

**Solution**: Cursor-based pagination, limit maximum page number, recommend search/filters instead deep pagination.

## Inconsistent Results

Data changes during pagination shifting items.

**Solution**: Cursor-based (stable), snapshot isolation (database level), accept inconsistency for non-critical data.

## Total Count Cost

`COUNT(*)` expensive on large tables.

**Solution**: Estimate total, cache count, omit total for infinite scroll, use approximate counts.

---

# 🔗 Interconexões

## RESTful API Client

Pagination/filtering/sorting integral to RESTful APIs (M16-01 resource client patterns).

## Performance Optimization

Caching paginated results (M10-performance), debouncing search requests.

## State Management

Tracking current page/filters/sort em React/Vue state, URL synchronization for bookmarking.

---

# 🚀 Evolução

## Relay-Style Pagination

Standardized cursor-based pagination (edges/nodes/pageInfo structure) em GraphQL.

## Elasticsearch Integration

Advanced full-text search, faceted filtering, aggregations, highlighting.

## Virtual Scrolling Libraries

React Virtualized, React Window rendering only visible items from massive datasets.

---

**Conclusão Integrada**: Pagination, filtering, sorting em Axios essential para efficient data retrieval from large datasets: **pagination fundamentals** (dividing data into manageable pages improving performance via smaller payloads/faster queries, enhancing UX via immediate feedback/progressive loading, metadata structure including total/page/limit/totalPages enabling UI controls/navigation), **pagination strategies** (offset-based via `?offset=20&limit=10` simple random access mas performance degrading with large offsets inconsistent with data changes, cursor-based via `?after=cursor123&limit=10` efficient consistent mas no random access ideal for infinite scroll, page-based via `?page=3&limit=10` user-friendly most common mas same offset issues), **offset pagination** (calculating offset `(page - 1) * limit`, random access jumping to any page, performance issues large offsets scanning many rows solution cursor-based or limit max page, implementation tracking page/total state loading on navigation), **cursor pagination** (using last item ID/timestamp as cursor `WHERE id > cursor`, consistency stable even with inserts/deletes during pagination, infinite scroll appending items on scroll via cursor progression, implementation tracking cursor/hasMore state Intersection Observer detecting scroll position), **page pagination** (page numbers user-friendly traditional UI `[1] [2] [3] ... [10]`, common pattern converting page to offset internally, URL synchronization reflecting page em query params for bookmarking), **filtering** (exact match via `?status=active&role=admin` combining multiple criteria, partial match via `?search=john` backend LIKE queries, range filters via `?price_min=10&price_max=100` or `?created_after=2025-01-01` date ranges, filter builder programmatically constructing complex filter objects), **search** (full-text search backend delegation via `?q=query`, debouncing delaying requests until user stops typing 300ms reducing server load, minimum query length 3 characters preventing excessive short queries), **sorting** (single field via `?sort=name` or `?sort=-name` descending with minus prefix, multiple fields via `?sort=role,name` comma-separated or `?sort=role,-created_at` mixed directions, direction control toggling asc/desc on column header clicks, default sorting server-defined when client omits sort param), **Axios implementation** (query parameters via `params` option automatic URL encoding avoiding manual concatenation, state management tracking page/filters/sort em React/Vue hooks, response parsing extracting data/meta/links from response, URL synchronization via useNavigate/URLSearchParams reflecting state for bookmarking/sharing), **advanced patterns** (infinite scroll loading more on scroll via Intersection Observer, virtual scrolling rendering only visible items from large datasets React Window, filter builder encapsulating complex filter construction, prefetching loading next page while user views current improving perceived performance). Performance considerations critical: limit page size balancing UX with performance typically 10-50 items, index database fields ensuring sort/filter fields indexed for fast queries, cache results avoiding redundant requests via React Query or manual cache, prefetch next page loading N+1 while viewing N, debounce search waiting 300ms after typing stops. Common challenges: inconsistent results offset-based pagination with data changes solution cursor-based stable results, total count performance `COUNT(*)` expensive on large tables solution estimate/cache/omit, complex filters many parameters making URLs long solution POST with filter body, filter validation ensuring valid combinations server-side, URL length limits browsers limiting query string solution POST for complex queries. Best practices: consistent parameter names page/limit/offset/sort across API, validate inputs page > 0 limit reasonable 1-100, return metadata total/currentPage/totalPages enabling UI pagination controls, support multiple formats offset/cursor/page-based for different use cases, document filters listing available filters/operators em API docs, default values sensible defaults when client omits page=1 limit=10. Critical understanding: pagination essential for scalability preventing massive responses overwhelming client/server, filtering narrowing results improving relevance reducing data transfer, sorting organizing logically enhancing UX, debouncing search critical avoiding excessive requests waiting until user finishes typing, cursor-based superior for large datasets/infinite scroll/real-time data mas page-based more user-friendly for traditional pagination UI, performance optimization via database indexing/caching/prefetching/virtual-scrolling enabling smooth UX even with massive datasets.