# KR Tech REST API Documentation (v9.0)

Base API URL: `http://localhost:5000/api` or `https://<your-backend-domain>/api`

All protected routes require an HTTP Authorization header in the following format:
```http
Authorization: Bearer <your_jwt_token>
```

---

## 1. System Health

### `GET /health`
Returns server operational health, database status, and active security middleware.

* **Access**: Public
* **Response (200 OK)**:
```json
{
  "status": "online",
  "service": "KR Tech Backend API v9.0 — Production Edition",
  "environment": "production",
  "timestamp": "2026-09-07T05:10:00.000Z",
  "security": "Helmet + RateLimiter + CORS Protection Active"
}
```

---

## 2. Authentication (`/api/auth`)

### `POST /api/auth/register`
Register a new student or administrator.

* **Access**: Public
* **Body**:
```json
{
  "name": "Aditya Sharma",
  "email": "aditya.sharma@example.com",
  "password": "SecurePassword123!",
  "phone": "+91 98765 43210",
  "role": "student"
}
```
* **Response (201 Created)**:
```json
{
  "success": true,
  "user": {
    "id": "65e8a9b...",
    "name": "Aditya Sharma",
    "email": "aditya.sharma@example.com",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Registration successful!"
}
```

### `POST /api/auth/login`
Authenticate existing user and issue a 30-day JWT.

* **Access**: Public
* **Body**:
```json
{
  "email": "admin@krtech.com",
  "password": "admin123"
}
```
* **Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "65e8a9b...",
    "name": "KR Tech Administrator",
    "email": "admin@krtech.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Admin login successful"
}
```

### `GET /api/auth/profile`
Retrieve currently logged-in user profile.

* **Access**: Private (Bearer Token)
* **Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "_id": "65e8a9b...",
    "name": "Aditya Sharma",
    "email": "aditya.sharma@example.com",
    "role": "student",
    "enrolledCourses": []
  }
}
```

### `GET /api/auth/students`
List all registered student profiles for the Admin dashboard.

* **Access**: Private (Admin Only)
* **Response (200 OK)**:
```json
{
  "success": true,
  "count": 24,
  "students": [...]
}
```

---

## 3. CRM Demo Leads (`/api/leads`)

### `POST /api/leads`
Submit a new 1:1 Live Demo request.

* **Access**: Public (Rate-limited: 60 req / 15 min)
* **Body**:
```json
{
  "name": "Rahul Verma",
  "email": "rahul.v@gmail.com",
  "phone": "+91 98765 12345",
  "course": "Complete Java Backend (Spring Boot 3.x)",
  "preferredTime": "Evening (6:00 PM - 8:00 PM IST)",
  "timeZone": "IST (UTC+5:30)",
  "message": "Looking for 1:1 microservices design mentorship."
}
```
* **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Thank you for booking a free demo! Our academic team will contact you shortly.",
  "lead": {
    "_id": "65e8f1c...",
    "status": "New",
    "createdAt": "2026-09-07T05:15:00.000Z"
  }
}
```

### `GET /api/leads`
Retrieve leads with optional status and text search filtering.

* **Access**: Private (Admin Only)
* **Query Parameters**: `?status=New&search=Rahul`
* **Response (200 OK)**:
```json
{
  "success": true,
  "count": 5,
  "leads": [...]
}
```

### `GET /api/leads/stats`
Aggregated conversion metrics for Admin Dashboard cards.

* **Access**: Private (Admin Only)
* **Response (200 OK)**:
```json
{
  "success": true,
  "stats": {
    "totalLeads": 18,
    "todayLeads": 3,
    "scheduledDemos": 6,
    "pendingFollowUps": 5,
    "completedDemos": 4,
    "totalCourses": 55,
    "totalMentors": 10,
    "totalStudents": 248
  }
}
```

### `PATCH /api/leads/:id`
Update lead status (`New`, `Contacted`, `Scheduled`, `Completed`) and counselor notes.

* **Access**: Private (Admin Only)
* **Body**:
```json
{
  "status": "Scheduled",
  "notes": "1:1 Demo booked for tomorrow at 7 PM with mentor Rajesh Kumar."
}
```

### `DELETE /api/leads/:id`
Delete a lead record.

* **Access**: Private (Admin Only)

---

## 4. Course Catalog (`/api/courses`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Public | List courses with `?category=` & `?search=` |
| `GET` | `/api/courses/:id` | Public | Get single course curriculum |
| `POST` | `/api/courses` | Admin | Create a new course entry |
| `PUT` | `/api/courses/:id` | Admin | Update course syllabus and pricing |
| `DELETE`| `/api/courses/:id` | Admin | Delete course from catalog |

---

## 5. Mentor Directory (`/api/mentors`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/mentors` | Public | List mentors with `?skill=` & `?search=` |
| `GET` | `/api/mentors/:id` | Public | Get single mentor bio & expertise |
| `POST` | `/api/mentors` | Admin | Add a new industry mentor |
| `PUT` | `/api/mentors/:id` | Admin | Update mentor profile |
| `DELETE`| `/api/mentors/:id` | Admin | Remove mentor from directory |
