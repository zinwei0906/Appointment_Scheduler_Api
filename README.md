# 📅 Appointment Scheduler API

A backend **Appointment Scheduling System API** built with **NestJS, PostgreSQL, and MikroORM**, supporting dynamic slot generation, booking management, and environment-based deployment.

---

# 🚀 Features

- Dynamic appointment slot generation (no cron job required)
- Book & cancel appointments
- Prevent double booking (date + time constraint)
- Configurable working hours (default: 9 AM – 6 PM)
- Configurable slot duration (default: 30 minutes)
- Environment-based configuration (development / staging / production)
- Swagger API documentation
- Redoc API documentation
- Input validation using Class Validator
- Clean architecture with NestJS modules

---

# 🧱 Tech Stack

- NestJS (v11)
- PostgreSQL
- MikroORM (v6)
- Swagger / OpenAPI
- Redoc
- Class Validator & Class Transformer
- DayJS
- Jest (unit & e2e testing)
- ESLint + Prettier

---

# 📁 Project Setup

## 1. Install dependencies

```bash
npm install
```

---

## 2. Environment Configuration

Create environment files:

```
.env.development
.env.staging
.env.production
```

### Example `.env.development`

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=appointment_dev
```

---

## 3. Create PostgreSQL Database

```sql
CREATE DATABASE appointment_dev;
```

---

## 4. Run the Project

### 🔥 Development (watch mode)

```bash
npm run start:dev
```

### 🐛 Debug mode

```bash
npm run start:debug
```

### 🧪 Staging

```bash
npm run start:staging
```

### 🚀 Production

```bash
npm run build
npm run start:prod
```

---

## 5. Build Commands

```bash
npm run build
npm run build:dev
npm run build:staging
npm run build:prod
```

---

# 📡 API Endpoints

## 📌 Get Available Slots

```http
GET /appointments/slots?date=2024-04-04
```

### Response

```json
[
  {
    "date": "2024-04-04",
    "time": "10:00",
    "available_slots": 1
  }
]
```

---

## 📌 Book Appointment

```http
POST /appointments
```

### Body

```json
{
  "date": "2024-04-04",
  "time": "10:00"
}
```

---

## 📌 Cancel Appointment

```http
DELETE /appointments
```

---

# 📖 API Documentation

## Swagger UI

```
http://localhost:3000/swagger
```

## Redoc UI

```
http://localhost:3000/docs
```

---

# 🧪 Testing

## Run unit tests

```bash
npm run test
```

## Watch mode

```bash
npm run test:watch
```

## Coverage report

```bash
npm run test:cov
```

## E2E tests

```bash
npm run test:e2e
```

---

# 🧠 System Design Notes

- Slots are generated dynamically at runtime
- Only bookings are persisted in the database
- Composite uniqueness (date + time) prevents double booking
- Configurable system behavior via environment variables
- Designed for single-provider appointment system

---

# ⚙️ Code Quality Tools

## Lint

```bash
npm run lint
```

## Format Code

```bash
npm run format
```
