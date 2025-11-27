# Admin API Testing Guide 4
## Support & Moderation, Analytics & Insights, System Settings

This guide provides comprehensive testing instructions for the final set of admin endpoints covering Support & Moderation, Analytics & Insights, and System Settings.

---

## Base URL

```
http://localhost:3000/api/v1/admin
```

**Note:** Replace `localhost:3000` with your actual server URL in production.

---

## Authentication

All endpoints require admin authentication. Include the admin token in the Authorization header:

```
Authorization: Bearer <admin_token>
```

To get an admin token, use the admin login endpoint:
```
POST /api/v1/admin/auth/login
```

---

## Table of Contents

1. [Support & Moderation](#support--moderation)
2. [Analytics & Insights](#analytics--insights)
3. [System Settings](#system-settings)

---

## Support & Moderation

### 1. View All Reports

**Endpoint:** `GET /reports/all`

**Description:** List all flagged users, posts, or events with optional filtering.

**Query Parameters:**
- `reportType` (optional): Filter by type - `post`, `event`, `mart`, `user`
- `status` (optional): Filter by status - `pending`, `resolved`, `rejected`
- `limit` (optional): Number of results per page (default: 50)
- `skip` (optional): Number of results to skip (default: 0)

**Example Request (Postman):**
```
GET {{base_url}}/reports/all?reportType=post&status=pending&limit=20&skip=0
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/reports/all \
  "Authorization:Bearer {{admin_token}}" \
  reportType==post \
  status==pending \
  limit==20 \
  skip==0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "_id": "60f7b3c4e4b0a1b2c3d4e5f6",
        "reportType": "post",
        "targetId": "60f7b3c4e4b0a1b2c3d4e5f7",
        "reportedBy": {
          "_id": "60f7b3c4e4b0a1b2c3d4e5f8",
          "email": "user@example.com"
        },
        "reason": "Inappropriate content",
        "status": "pending",
        "resolvedBy": null,
        "resolvedAt": null,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 20,
      "skip": 0,
      "totalPages": 1
    }
  }
}
```

---

### 2. Assign Moderator Role

**Endpoint:** `PATCH /users/:userId/assign-moderator`

**Description:** Give a user or team member moderation rights.

**Path Parameters:**
- `userId`: The ID of the user to assign moderator role

**Example Request (Postman):**
```
PATCH {{base_url}}/users/60f7b3c4e4b0a1b2c3d4e5f8/assign-moderator
```

**Example Request (HTTPie):**
```bash
http PATCH {{base_url}}/users/60f7b3c4e4b0a1b2c3d4e5f8/assign-moderator \
  "Authorization:Bearer {{admin_token}}"
```

**Response:**
```json
{
  "success": true,
  "message": "Moderator role assigned successfully",
  "data": {
    "_id": "60f7b3c4e4b0a1b2c3d4e5f8",
    "email": "user@example.com",
    "role": "moderator"
  }
}
```

---

### 3. Remove Moderator Role

**Endpoint:** `PATCH /users/:userId/remove-moderator`

**Description:** Remove moderation rights from a user.

**Path Parameters:**
- `userId`: The ID of the user to remove moderator role from

**Example Request (Postman):**
```
PATCH {{base_url}}/users/60f7b3c4e4b0a1b2c3d4e5f8/remove-moderator
```

**Example Request (HTTPie):**
```bash
http PATCH {{base_url}}/users/60f7b3c4e4b0a1b2c3d4e5f8/remove-moderator \
  "Authorization:Bearer {{admin_token}}"
```

**Response:**
```json
{
  "success": true,
  "message": "Moderator role removed successfully",
  "data": {
    "_id": "60f7b3c4e4b0a1b2c3d4e5f8",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

### 4. Get All Support Tickets

**Endpoint:** `GET /tickets`

**Description:** List all user support tickets with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by status - `pending`, `in_progress`, `resolved`, `dismissed`
- `category` (optional): Filter by category - `technical`, `billing`, `account`, `general`, `report`
- `priority` (optional): Filter by priority - `low`, `medium`, `high`, `urgent`
- `assignedTo` (optional): Filter by assigned moderator/admin ID
- `limit` (optional): Number of results per page (default: 50)
- `skip` (optional): Number of results to skip (default: 0)

**Example Request (Postman):**
```
GET {{base_url}}/tickets?status=pending&category=technical&limit=20
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/tickets \
  "Authorization:Bearer {{admin_token}}" \
  status==pending \
  category==technical \
  limit==20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "_id": "60f7b3c4e4b0a1b2c3d4e5f9",
        "userId": {
          "_id": "60f7b3c4e4b0a1b2c3d4e5f8",
          "email": "user@example.com"
        },
        "subject": "Unable to upload profile picture",
        "description": "I keep getting an error when trying to upload my profile picture.",
        "category": "technical",
        "status": "pending",
        "priority": "medium",
        "assignedTo": null,
        "responses": [],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 20,
      "skip": 0,
      "totalPages": 1
    }
  }
}
```

---

### 5. Respond to User Ticket

**Endpoint:** `POST /tickets/:ticketId/respond`

**Description:** Reply to a user complaint or support ticket.

**Path Parameters:**
- `ticketId`: The ID of the ticket to respond to

**Request Body:**
```json
{
  "message": "Thank you for reporting this issue. We have resolved it on our end. Please try uploading your profile picture again."
}
```

**Example Request (Postman):**
```
POST {{base_url}}/tickets/60f7b3c4e4b0a1b2c3d4e5f9/respond
Content-Type: application/json

{
  "message": "Thank you for reporting this issue. We have resolved it on our end. Please try uploading your profile picture again."
}
```

**Example Request (HTTPie):**
```bash
http POST {{base_url}}/tickets/60f7b3c4e4b0a1b2c3d4e5f9/respond \
  "Authorization:Bearer {{admin_token}}" \
  "Content-Type:application/json" \
  message="Thank you for reporting this issue. We have resolved it on our end. Please try uploading your profile picture again."
```

**Response:**
```json
{
  "success": true,
  "message": "Response added successfully",
  "data": {
    "_id": "60f7b3c4e4b0a1b2c3d4e5f9",
    "userId": "60f7b3c4e4b0a1b2c3d4e5f8",
    "subject": "Unable to upload profile picture",
    "status": "in_progress",
    "responses": [
      {
        "userId": "60f7b3c4e4b0a1b2c3d4e5f0",
        "message": "Thank you for reporting this issue. We have resolved it on our end. Please try uploading your profile picture again.",
        "isAdmin": true,
        "createdAt": "2024-01-15T11:00:00.000Z"
      }
    ]
  }
}
```

---

### 6. Update Ticket Status

**Endpoint:** `PATCH /tickets/:ticketId/status`

**Description:** Update the resolution status of a ticket (pending, in_progress, resolved, dismissed).

**Path Parameters:**
- `ticketId`: The ID of the ticket to update

**Request Body:**
```json
{
  "status": "resolved"
}
```

**Example Request (Postman):**
```
PATCH {{base_url}}/tickets/60f7b3c4e4b0a1b2c3d4e5f9/status
Content-Type: application/json

{
  "status": "resolved"
}
```

**Example Request (HTTPie):**
```bash
http PATCH {{base_url}}/tickets/60f7b3c4e4b0a1b2c3d4e5f9/status \
  "Authorization:Bearer {{admin_token}}" \
  "Content-Type:application/json" \
  status=resolved
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket status updated to resolved",
  "data": {
    "_id": "60f7b3c4e4b0a1b2c3d4e5f9",
    "status": "resolved",
    "resolvedBy": "60f7b3c4e4b0a1b2c3d4e5f0",
    "resolvedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

---

### 7. Assign Ticket to Moderator

**Endpoint:** `PATCH /tickets/:ticketId/assign`

**Description:** Assign a support ticket to a specific moderator.

**Path Parameters:**
- `ticketId`: The ID of the ticket to assign

**Request Body:**
```json
{
  "moderatorId": "60f7b3c4e4b0a1b2c3d4e5f1"
}
```

**Example Request (Postman):**
```
PATCH {{base_url}}/tickets/60f7b3c4e4b0a1b2c3d4e5f9/assign
Content-Type: application/json

{
  "moderatorId": "60f7b3c4e4b0a1b2c3d4e5f1"
}
```

**Example Request (HTTPie):**
```bash
http PATCH {{base_url}}/tickets/60f7b3c4e4b0a1b2c3d4e5f9/assign \
  "Authorization:Bearer {{admin_token}}" \
  "Content-Type:application/json" \
  moderatorId=60f7b3c4e4b0a1b2c3d4e5f1
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket assigned successfully",
  "data": {
    "_id": "60f7b3c4e4b0a1b2c3d4e5f9",
    "assignedTo": "60f7b3c4e4b0a1b2c3d4e5f1",
    "status": "in_progress"
  }
}
```

---

## Analytics & Insights

### 8. View User Growth

**Endpoint:** `GET /analytics/user-growth`

**Description:** Track new signups by city/country and date.

**Query Parameters:**
- `dateFrom` (optional): Start date (ISO 8601 format, e.g., `2024-01-01`)
- `dateTo` (optional): End date (ISO 8601 format, e.g., `2024-01-31`)
- `groupBy` (optional): Grouping period - `day`, `week`, `month` (default: `day`)

**Example Request (Postman):**
```
GET {{base_url}}/analytics/user-growth?dateFrom=2024-01-01&dateTo=2024-01-31&groupBy=day
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/analytics/user-growth \
  "Authorization:Bearer {{admin_token}}" \
  dateFrom==2024-01-01 \
  dateTo==2024-01-31 \
  groupBy==day
```

**Response:**
```json
{
  "success": true,
  "data": {
    "signupsByDate": [
      {
        "_id": {
          "year": 2024,
          "month": 1,
          "day": 15
        },
        "count": 25
      }
    ],
    "signupsByLocation": [
      {
        "_id": {
          "city": "London",
          "country": "UK"
        },
        "count": 150
      }
    ],
    "summary": {
      "totalUsers": 5000,
      "totalUsersInPeriod": 750,
      "period": {
        "from": "2024-01-01T00:00:00.000Z",
        "to": "2024-01-31T23:59:59.999Z"
      }
    }
  }
}
```

---

### 9. Engagement Metrics

**Endpoint:** `GET /analytics/engagement`

**Description:** Get engagement metrics for posts, chats, and events attended.

**Query Parameters:**
- `dateFrom` (optional): Start date (ISO 8601 format)
- `dateTo` (optional): End date (ISO 8601 format)

**Example Request (Postman):**
```
GET {{base_url}}/analytics/engagement?dateFrom=2024-01-01&dateTo=2024-01-31
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/analytics/engagement \
  "Authorization:Bearer {{admin_token}}" \
  dateFrom==2024-01-01 \
  dateTo==2024-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": {
      "total": 1250,
      "byDate": [
        {
          "_id": {
            "year": 2024,
            "month": 1,
            "day": 15
          },
          "count": 45
        }
      ]
    },
    "messages": {
      "total": 3500,
      "byDate": [
        {
          "_id": {
            "year": 2024,
            "month": 1,
            "day": 15
          },
          "count": 120
        }
      ]
    },
    "eventsAttended": {
      "total": 850,
      "byDate": [
        {
          "_id": {
            "year": 2024,
            "month": 1,
            "day": 15
          },
          "count": 30
        }
      ]
    },
    "period": {
      "from": "2024-01-01T00:00:00.000Z",
      "to": "2024-01-31T23:59:59.999Z"
    }
  }
}
```

---

### 10. Revenue Analytics

**Endpoint:** `GET /analytics/revenue`

**Description:** Get revenue analytics from subscriptions, tickets, and marketplace.

**Query Parameters:**
- `dateFrom` (optional): Start date (ISO 8601 format)
- `dateTo` (optional): End date (ISO 8601 format)

**Example Request (Postman):**
```
GET {{base_url}}/analytics/revenue?dateFrom=2024-01-01&dateTo=2024-01-31
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/analytics/revenue \
  "Authorization:Bearer {{admin_token}}" \
  dateFrom==2024-01-01 \
  dateTo==2024-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscriptions": {
      "total": 5000,
      "count": 150
    },
    "tickets": {
      "total": 12000,
      "count": 300
    },
    "marketplace": {
      "total": 8000,
      "count": 200
    },
    "totalRevenue": 25000,
    "revenueByDate": [
      {
        "_id": {
          "year": 2024,
          "month": 1,
          "day": 15
        },
        "total": 850,
        "count": 25
      }
    ],
    "period": {
      "from": "2024-01-01T00:00:00.000Z",
      "to": "2024-01-31T23:59:59.999Z"
    }
  }
}
```

---

### 11. Top Cities & Communities

**Endpoint:** `GET /analytics/top-cities`

**Description:** See most active user clusters by users, posts, and events.

**Query Parameters:**
- `limit` (optional): Number of top cities to return (default: 20)

**Example Request (Postman):**
```
GET {{base_url}}/analytics/top-cities?limit=10
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/analytics/top-cities \
  "Authorization:Bearer {{admin_token}}" \
  limit==10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "topCitiesByUsers": [
      {
        "_id": {
          "city": "London",
          "country": "UK"
        },
        "userCount": 500
      }
    ],
    "topCitiesByPosts": [
      {
        "_id": {
          "city": "London",
          "country": "UK"
        },
        "postCount": 1250,
        "userCount": 500
      }
    ],
    "topCitiesByEvents": [
      {
        "_id": {
          "city": "London",
          "country": "UK"
        },
        "eventCount": 85
      }
    ]
  }
}
```

---

### 12. Churn & Retention Reports

**Endpoint:** `GET /analytics/churn-retention`

**Description:** Identify drop-offs and calculate retention rates.

**Query Parameters:**
- `dateFrom` (optional): Start date (ISO 8601 format)
- `dateTo` (optional): End date (ISO 8601 format)
- `period` (optional): Period in days for analysis (default: 30)

**Example Request (Postman):**
```
GET {{base_url}}/analytics/churn-retention?period=30
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/analytics/churn-retention \
  "Authorization:Bearer {{admin_token}}" \
  period==30
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "newUsers": 750,
      "activeUsers": 600,
      "churnedUsers": 150,
      "totalUsers": 5000,
      "churnRate": 3.0,
      "retentionRate": 80.0
    },
    "retentionData": [
      {
        "_id": 0,
        "count": 750,
        "active": 750
      },
      {
        "_id": 7,
        "count": 700,
        "active": 650
      }
    ],
    "period": {
      "from": "2024-01-01T00:00:00.000Z",
      "to": "2024-01-31T23:59:59.999Z",
      "days": 30
    }
  }
}
```

---

## System Settings

### 13. Assign Admin Role

**Endpoint:** `PATCH /users/:userId/assign-admin`

**Description:** Add a user as an admin with full system access.

**Path Parameters:**
- `userId`: The ID of the user to assign admin role

**Example Request (Postman):**
```
PATCH {{base_url}}/users/60f7b3c4e4b0a1b2c3d4e5f8/assign-admin
```

**Example Request (HTTPie):**
```bash
http PATCH {{base_url}}/users/60f7b3c4e4b0a1b2c3d4e5f8/assign-admin \
  "Authorization:Bearer {{admin_token}}"
```

**Response:**
```json
{
  "success": true,
  "message": "Admin role assigned successfully",
  "data": {
    "_id": "60f7b3c4e4b0a1b2c3d4e5f8",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

### 14. Remove Admin Role

**Endpoint:** `PATCH /users/:userId/remove-admin`

**Description:** Remove admin privileges from a user. Cannot remove the last admin.

**Path Parameters:**
- `userId`: The ID of the user to remove admin role from

**Example Request (Postman):**
```
PATCH {{base_url}}/users/60f7b3c4e4b0a1b2c3d4e5f8/remove-admin
```

**Example Request (HTTPie):**
```bash
http PATCH {{base_url}}/users/60f7b3c4e4b0a1b2c3d4e5f8/remove-admin \
  "Authorization:Bearer {{admin_token}}"
```

**Response:**
```json
{
  "success": true,
  "message": "Admin role removed successfully",
  "data": {
    "_id": "60f7b3c4e4b0a1b2c3d4e5f8",
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

### 15. Get All Admins

**Endpoint:** `GET /admins`

**Description:** List all users with admin role.

**Example Request (Postman):**
```
GET {{base_url}}/admins
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/admins \
  "Authorization:Bearer {{admin_token}}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "admins": [
      {
        "_id": "60f7b3c4e4b0a1b2c3d4e5f0",
        "email": "admin@example.com",
        "role": "admin",
        "isActive": true,
        "isSuspended": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "lastLogin": "2024-01-15T10:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

### 16. Get App Content

**Endpoint:** `GET /app-content/:page`

**Description:** Retrieve content for a specific static page.

**Path Parameters:**
- `page`: Page type - `about`, `terms`, `privacy`, `faq`, `help`

**Example Request (Postman):**
```
GET {{base_url}}/app-content/terms
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/app-content/terms \
  "Authorization:Bearer {{admin_token}}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3c4e4b0a1b2c3d4e5fa",
    "page": "terms",
    "title": "Terms of Service",
    "content": "By using our service, you agree to...",
    "lastUpdatedBy": {
      "_id": "60f7b3c4e4b0a1b2c3d4e5f0",
      "email": "admin@example.com"
    },
    "version": 2,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-10T00:00:00.000Z"
  }
}
```

---

### 17. Update App Content

**Endpoint:** `PATCH /app-content/:page`

**Description:** Edit static pages (About, Terms, Privacy, FAQ, Help).

**Path Parameters:**
- `page`: Page type - `about`, `terms`, `privacy`, `faq`, `help`

**Request Body:**
```json
{
  "title": "Updated Terms of Service",
  "content": "Updated terms content here..."
}
```

**Example Request (Postman):**
```
PATCH {{base_url}}/app-content/terms
Content-Type: application/json

{
  "title": "Updated Terms of Service",
  "content": "Updated terms content here..."
}
```

**Example Request (HTTPie):**
```bash
http PATCH {{base_url}}/app-content/terms \
  "Authorization:Bearer {{admin_token}}" \
  "Content-Type:application/json" \
  title="Updated Terms of Service" \
  content="Updated terms content here..."
```

**Response:**
```json
{
  "success": true,
  "message": "App content updated successfully",
  "data": {
    "_id": "60f7b3c4e4b0a1b2c3d4e5fa",
    "page": "terms",
    "title": "Updated Terms of Service",
    "content": "Updated terms content here...",
    "version": 3,
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

### 18. Get All App Content

**Endpoint:** `GET /app-content`

**Description:** Retrieve all static page content.

**Example Request (Postman):**
```
GET {{base_url}}/app-content
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/app-content \
  "Authorization:Bearer {{admin_token}}"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3c4e4b0a1b2c3d4e5fa",
      "page": "about",
      "title": "About Us",
      "content": "About content...",
      "version": 1
    },
    {
      "_id": "60f7b3c4e4b0a1b2c3d4e5fb",
      "page": "terms",
      "title": "Terms of Service",
      "content": "Terms content...",
      "version": 2
    }
  ]
}
```

---

### 19. Get Notification Settings

**Endpoint:** `GET /notifications/settings`

**Description:** Retrieve all global push/email notification templates and settings.

**Example Request (Postman):**
```
GET {{base_url}}/notifications/settings
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/notifications/settings \
  "Authorization:Bearer {{admin_token}}"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3c4e4b0a1b2c3d4e5fc",
      "key": "notification_email_welcome",
      "value": "Welcome to our platform!",
      "description": "Welcome email template"
    }
  ]
}
```

---

### 20. Update Notification Settings

**Endpoint:** `PATCH /notifications/settings`

**Description:** Set global push/email templates.

**Request Body:**
```json
{
  "key": "notification_email_welcome",
  "value": "Welcome to our amazing platform!"
}
```

**Example Request (Postman):**
```
PATCH {{base_url}}/notifications/settings
Content-Type: application/json

{
  "key": "notification_email_welcome",
  "value": "Welcome to our amazing platform!"
}
```

**Example Request (HTTPie):**
```bash
http PATCH {{base_url}}/notifications/settings \
  "Authorization:Bearer {{admin_token}}" \
  "Content-Type:application/json" \
  key=notification_email_welcome \
  value="Welcome to our amazing platform!"
```

**Response:**
```json
{
  "success": true,
  "message": "Notification setting updated successfully",
  "data": {
    "key": "notification_email_welcome",
    "value": "Welcome to our amazing platform!"
  }
}
```

---

### 21. Backup Database

**Endpoint:** `POST /backup`

**Description:** Export system data (placeholder - requires MongoDB dump implementation).

**Example Request (Postman):**
```
POST {{base_url}}/backup
```

**Example Request (HTTPie):**
```bash
http POST {{base_url}}/backup \
  "Authorization:Bearer {{admin_token}}"
```

**Response:**
```json
{
  "success": true,
  "message": "Database backup initiated",
  "data": {
    "timestamp": "2024-01-15T12:00:00.000Z",
    "note": "This is a placeholder. Implement actual backup logic using MongoDB dump or a backup service."
  }
}
```

---

### 22. Get All Integrations

**Endpoint:** `GET /integrations`

**Description:** List all integration settings (Payment API, email provider, analytics tools).

**Example Request (Postman):**
```
GET {{base_url}}/integrations
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/integrations \
  "Authorization:Bearer {{admin_token}}"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3c4e4b0a1b2c3d4e5fd",
      "name": "stripe",
      "type": "payment",
      "isActive": true,
      "config": {
        "apiKey": "sk_test_...",
        "webhookSecret": "whsec_..."
      },
      "lastUpdatedBy": {
        "_id": "60f7b3c4e4b0a1b2c3d4e5f0",
        "email": "admin@example.com"
      }
    }
  ]
}
```

---

### 23. Get Integration

**Endpoint:** `GET /integrations/:name`

**Description:** Retrieve settings for a specific integration.

**Path Parameters:**
- `name`: Integration name - `stripe`, `paypal`, `sendgrid`, `mailgun`, `twilio`, `google_analytics`, `mixpanel`, `firebase`

**Example Request (Postman):**
```
GET {{base_url}}/integrations/stripe
```

**Example Request (HTTPie):**
```bash
http GET {{base_url}}/integrations/stripe \
  "Authorization:Bearer {{admin_token}}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3c4e4b0a1b2c3d4e5fd",
    "name": "stripe",
    "type": "payment",
    "isActive": true,
    "config": {
      "apiKey": "sk_test_...",
      "webhookSecret": "whsec_..."
    }
  }
}
```

---

### 24. Update Integration

**Endpoint:** `PATCH /integrations/:name`

**Description:** Update integration settings (Payment API, email provider, analytics tools).

**Path Parameters:**
- `name`: Integration name - `stripe`, `paypal`, `sendgrid`, `mailgun`, `twilio`, `google_analytics`, `mixpanel`, `firebase`

**Request Body:**
```json
{
  "isActive": true,
  "config": {
    "apiKey": "sk_live_new_key",
    "webhookSecret": "whsec_new_secret"
  }
}
```

**Example Request (Postman):**
```
PATCH {{base_url}}/integrations/stripe
Content-Type: application/json

{
  "isActive": true,
  "config": {
    "apiKey": "sk_live_new_key",
    "webhookSecret": "whsec_new_secret"
  }
}
```

**Example Request (HTTPie):**
```bash
http PATCH {{base_url}}/integrations/stripe \
  "Authorization:Bearer {{admin_token}}" \
  "Content-Type:application/json" \
  isActive:=true \
  config:='{"apiKey":"sk_live_new_key","webhookSecret":"whsec_new_secret"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Integration updated successfully",
  "data": {
    "_id": "60f7b3c4e4b0a1b2c3d4e5fd",
    "name": "stripe",
    "type": "payment",
    "isActive": true,
    "config": {
      "apiKey": "sk_live_new_key",
      "webhookSecret": "whsec_new_secret"
    },
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authorization token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied, admin only"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Field is required"]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing Tips

1. **Authentication**: Always include the admin token in the Authorization header for all requests.

2. **Date Formats**: Use ISO 8601 format for dates (e.g., `2024-01-15` or `2024-01-15T10:30:00.000Z`).

3. **Pagination**: Use `limit` and `skip` query parameters for paginated endpoints.

4. **Error Handling**: Check the response `success` field to determine if the request was successful.

5. **Testing Order**: Some endpoints depend on others (e.g., assigning a moderator requires a user to exist first).

---

## Notes

- The backup endpoint is a placeholder and requires actual MongoDB dump/export implementation.
- Notification settings use the Settings model with keys prefixed with `notification_`.
- Integration configs are stored as JSON objects and can be updated incrementally.
- Admin role management prevents removing the last admin to ensure system access.

---

**End of Guide**

