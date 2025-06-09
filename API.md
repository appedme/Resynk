# Resynk API Documentation

## Authentication

All API endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Base URL
```
https://api.resynk.dev/v1
```

## Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "plan": "free"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### GET /auth/me
Get current user information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "plan": "premium",
    "usage": {
      "resumes_created": 5,
      "ai_credits_used": 120,
      "storage_used": "2.5MB"
    }
  }
}
```

### Resume Management

#### GET /resumes
Get all resumes for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of resumes per page (max 50)
- `search` (optional): Search term for resume titles

**Response:**
```json
{
  "success": true,
  "data": {
    "resumes": [
      {
        "id": "resume_123",
        "title": "Software Engineer Resume",
        "template_id": "modern_tech",
        "created_at": "2025-06-09T10:00:00Z",
        "updated_at": "2025-06-09T15:30:00Z",
        "is_public": false,
        "version": 3
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_count": 15
    }
  }
}
```

#### POST /resumes
Create a new resume.

**Request Body:**
```json
{
  "title": "My New Resume",
  "template_id": "modern_professional",
  "data": {
    "personal": {
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-0123",
      "location": "San Francisco, CA",
      "linkedin": "linkedin.com/in/johndoe",
      "portfolio": "johndoe.dev"
    },
    "summary": "Experienced software engineer...",
    "experience": [...],
    "education": [...],
    "skills": [...]
  }
}
```

#### GET /resumes/{id}
Get a specific resume by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "resume_123",
    "title": "Software Engineer Resume",
    "template_id": "modern_tech",
    "data": {
      "personal": {...},
      "summary": "...",
      "experience": [...],
      "education": [...],
      "skills": [...]
    },
    "settings": {
      "color_scheme": "blue",
      "font_family": "Inter",
      "page_margin": "normal"
    },
    "version": 3,
    "created_at": "2025-06-09T10:00:00Z",
    "updated_at": "2025-06-09T15:30:00Z"
  }
}
```

#### PUT /resumes/{id}
Update an existing resume.

**Request Body:** Same as POST /resumes

#### DELETE /resumes/{id}
Delete a resume.

**Response:**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

#### POST /resumes/{id}/duplicate
Create a copy of an existing resume.

**Request Body:**
```json
{
  "title": "Copy of My Resume"
}
```

### Template Management

#### GET /templates
Get available resume templates.

**Query Parameters:**
- `category` (optional): Filter by category (professional, creative, minimal, etc.)
- `industry` (optional): Filter by industry

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "modern_professional",
        "name": "Modern Professional",
        "description": "Clean and modern design perfect for corporate roles",
        "category": "professional",
        "preview_url": "https://cdn.resynk.dev/templates/modern_professional.png",
        "is_premium": false
      }
    ]
  }
}
```

#### GET /templates/{id}
Get template details and structure.

### AI Services

#### POST /ai/suggestions
Get AI-powered content suggestions.

**Request Body:**
```json
{
  "section": "experience",
  "context": {
    "job_title": "Software Engineer",
    "company": "Tech Corp",
    "industry": "Technology"
  },
  "current_content": "Worked on web applications..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "improvement",
        "original": "Worked on web applications",
        "suggested": "Developed and maintained 5+ scalable web applications serving 10,000+ daily active users",
        "reason": "Added quantifiable metrics and impact"
      }
    ],
    "keywords": ["React", "Node.js", "AWS", "Agile"],
    "ats_score": 78
  }
}
```

#### POST /ai/optimize-ats
Analyze and optimize resume for ATS compatibility.

**Request Body:**
```json
{
  "resume_id": "resume_123",
  "job_posting": "We are looking for a senior software engineer with 5+ years experience in React, Node.js, and AWS..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ats_score": 85,
    "missing_keywords": ["Docker", "Kubernetes", "CI/CD"],
    "recommendations": [
      {
        "section": "skills",
        "suggestion": "Add Docker and Kubernetes to your skills section",
        "impact": "high"
      }
    ],
    "match_percentage": 78
  }
}
```

#### POST /ai/generate-summary
Generate a professional summary based on experience.

**Request Body:**
```json
{
  "experience": [...],
  "target_role": "Senior Software Engineer",
  "industry": "Technology",
  "tone": "professional"
}
```

### Export Services

#### POST /export/pdf
Generate PDF version of resume.

**Request Body:**
```json
{
  "resume_id": "resume_123",
  "options": {
    "format": "A4",
    "quality": "high",
    "include_links": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "download_url": "https://cdn.resynk.dev/exports/resume_123.pdf",
    "expires_at": "2025-06-10T10:00:00Z"
  }
}
```

#### POST /export/html
Generate HTML version of resume.

#### POST /export/json
Export resume data as JSON.

#### POST /export/docx
Generate Microsoft Word version.

### Analytics

#### GET /analytics/resume/{id}
Get analytics for a specific resume.

**Response:**
```json
{
  "success": true,
  "data": {
    "views": 45,
    "downloads": 12,
    "shares": 3,
    "applications_tracked": 8,
    "view_history": [
      {
        "date": "2025-06-09",
        "views": 5,
        "downloads": 2
      }
    ]
  }
}
```

#### GET /analytics/dashboard
Get user dashboard analytics.

### Collaboration

#### POST /resumes/{id}/share
Share resume with collaborators.

**Request Body:**
```json
{
  "email": "collaborator@example.com",
  "permission": "edit" // or "view"
}
```

#### GET /resumes/{id}/collaborators
Get list of collaborators for a resume.

#### PUT /resumes/{id}/collaborators/{user_id}
Update collaborator permissions.

#### DELETE /resumes/{id}/collaborators/{user_id}
Remove collaborator access.

### Version Control

#### GET /resumes/{id}/versions
Get version history for a resume.

**Response:**
```json
{
  "success": true,
  "data": {
    "versions": [
      {
        "version": 3,
        "created_at": "2025-06-09T15:30:00Z",
        "created_by": "user_123",
        "changes_summary": "Updated experience section",
        "is_current": true
      },
      {
        "version": 2,
        "created_at": "2025-06-09T14:00:00Z",
        "created_by": "user_456",
        "changes_summary": "Added new project",
        "is_current": false
      }
    ]
  }
}
```

#### POST /resumes/{id}/versions/{version}/restore
Restore a specific version.

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {...}
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "constraint": "Valid email address required"
    }
  }
}
```

## Rate Limiting

API endpoints are rate limited:
- **Free tier**: 100 requests per hour
- **Premium tier**: 1000 requests per hour
- **Enterprise tier**: 10000 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623456789
```

## Webhooks

Subscribe to events via webhooks:

**Available Events:**
- `resume.created`
- `resume.updated`
- `resume.shared`
- `export.completed`
- `collaboration.added`

**Webhook Payload:**
```json
{
  "event": "resume.updated",
  "data": {
    "resume_id": "resume_123",
    "user_id": "user_123",
    "timestamp": "2025-06-09T15:30:00Z"
  }
}
```
