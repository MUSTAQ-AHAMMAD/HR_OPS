# API Documentation

## Table of Contents
- [Authentication](#authentication)
- [Health Check](#health-check)
- [Users](#users)
- [Brands](#brands)
- [Templates](#templates)
- [Employees](#employees)
- [Analytics](#analytics)
- [AI Services](#ai-services)

---

## Base URL
```
http://localhost:3000/api
```

## Response Format
All API responses follow a consistent format:

**Success Response:**
```json
{
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Health Check

### GET /api/health
Check the health status of the application and its dependencies.

**Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": "healthy",
  "services": {
    "database": { "status": "healthy" },
    "configuration": { "status": "healthy" },
    "openai": { "status": "configured" },
    "azure": { "status": "configured" }
  }
}
```

**Status Codes:**
- `200` - All services healthy
- `503` - One or more services degraded

---

## Authentication

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123!"
}
```

**Validation Requirements:**
- Email must be valid
- Name must be at least 2 characters
- Password must:
  - Be at least 8 characters
  - Contain uppercase letter
  - Contain lowercase letter
  - Contain number
  - Contain special character

**Response (201):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

**Error Codes:**
- `400` - Validation failed or user already exists
- `500` - Server error

---

### POST /api/auth/login
Authenticate a user and create a session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "token": "jwt_token_here"
}
```

**Error Codes:**
- `401` - Invalid credentials
- `400` - Validation failed
- `500` - Server error

---

## Brands

### GET /api/brands
Get all brands with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search term

**Response (200):**
```json
{
  "brands": [
    {
      "id": "brand_123",
      "name": "Acme Corporation",
      "description": "Leading tech company",
      "primaryColor": "#3b82f6",
      "secondaryColor": "#64748b",
      "logo": "https://example.com/logo.png",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### POST /api/brands
Create a new brand.

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "description": "Leading tech company",
  "primaryColor": "#3b82f6",
  "secondaryColor": "#64748b",
  "logo": "https://example.com/logo.png"
}
```

**Validation:**
- Name: minimum 2 characters (required)
- Primary/Secondary Color: valid hex color (#RRGGBB)
- Logo: valid URL (optional)

**Response (201):**
```json
{
  "brand": {
    "id": "brand_123",
    "name": "Acme Corporation",
    ...
  }
}
```

---

### PUT /api/brands/[id]
Update an existing brand.

**Request Body:** Same as POST /api/brands

**Response (200):**
```json
{
  "brand": { ... }
}
```

---

### DELETE /api/brands/[id]
Delete a brand.

**Response (200):**
```json
{
  "message": "Brand deleted successfully"
}
```

---

## Templates

### GET /api/templates
Get all templates with filtering.

**Query Parameters:**
- `page`, `limit`: Pagination
- `brandId` (optional): Filter by brand
- `status` (optional): DRAFT | PUBLISHED | ARCHIVED
- `search` (optional): Search in name and content

**Response (200):**
```json
{
  "templates": [
    {
      "id": "template_123",
      "name": "Welcome Email",
      "description": "Welcome new users",
      "content": "Hello {{name}}, welcome!",
      "brandId": "brand_123",
      "category": "email",
      "tags": ["onboarding", "welcome"],
      "status": "PUBLISHED",
      "version": 1,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### POST /api/templates
Create a new template.

**Request Body:**
```json
{
  "name": "Welcome Email",
  "description": "Welcome new users",
  "content": "Hello {{name}}, welcome!",
  "brandId": "brand_123",
  "category": "email",
  "tags": ["onboarding", "welcome"],
  "status": "DRAFT"
}
```

**Response (201):**
```json
{
  "template": { ... }
}
```

---

## Employees

### GET /api/employees
Get all employees with filtering.

**Query Parameters:**
- `page`, `limit`: Pagination
- `department` (optional): Filter by department
- `search` (optional): Search in name and email

**Response (200):**
```json
{
  "employees": [
    {
      "id": "emp_123",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "displayName": "John Doe",
      "jobTitle": "Software Engineer",
      "department": "Engineering",
      "officeLocation": "San Francisco",
      "phoneNumber": "+1234567890",
      "avatar": "https://example.com/avatar.jpg",
      "isActive": true,
      "syncedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### POST /api/employees
Create or update employee (upsert).

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "displayName": "John Doe",
  "jobTitle": "Software Engineer",
  "department": "Engineering",
  "officeLocation": "San Francisco",
  "phoneNumber": "+1234567890",
  "avatar": "https://example.com/avatar.jpg",
  "metadata": {
    "employeeId": "EMP001",
    "managerId": "MGR001"
  }
}
```

**Response (201):**
```json
{
  "employee": { ... }
}
```

---

## Analytics

### GET /api/analytics
Get usage analytics and statistics.

**Query Parameters:**
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `type` (optional): Event type filter

**Response (200):**
```json
{
  "stats": {
    "totalBrands": 12,
    "totalTemplates": 48,
    "totalEmployees": 235,
    "activeUsers": 18
  },
  "events": [
    {
      "id": "event_123",
      "type": "TEMPLATE_CREATED",
      "userId": "user_123",
      "metadata": { ... },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## AI Services

### POST /api/ai/grammar
Check grammar and spelling using AI.

**Request Body:**
```json
{
  "text": "This is a test sentance with an error."
}
```

**Response (200):**
```json
{
  "originalText": "This is a test sentance with an error.",
  "correctedText": "This is a test sentence with an error.",
  "corrections": [
    {
      "original": "sentance",
      "corrected": "sentence",
      "position": 15,
      "type": "spelling"
    }
  ]
}
```

**Requirements:**
- `OPENAI_API_KEY` environment variable must be set

**Error Codes:**
- `400` - Invalid request
- `500` - AI service error
- `503` - OpenAI API not configured

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation failed |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - Dependency failure |

---

## Rate Limiting

Default rate limits:
- **100 requests per 15 minutes** per IP address

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

---

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Security

All API endpoints implement:
- Input validation with Zod schemas
- XSS prevention through sanitization
- SQL injection prevention via Prisma ORM
- Rate limiting
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)

---

## Testing

Use the demo credentials for testing:
- **Email:** admin@hrops.com
- **Password:** Admin@123
