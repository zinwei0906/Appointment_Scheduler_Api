# 📅 Appointment Scheduler API

A simple appointment scheduling system built with **NestJS + PostgreSQL + MikroORM**, supporting configurable time slots, booking, and API documentation.

---

# 🚀 Features

- Generate available time slots dynamically
- Book appointments with validation
- Prevent double booking
- Configurable working hours (9 AM – 6 PM)
- Configurable slot duration (default: 30 mins)
- Environment-based configuration (dev / staging / prod)
- Swagger API documentation
- Redoc documentation UI

---

# 🧱 Tech Stack

- NestJS
- PostgreSQL
- MikroORM
- Swagger (OpenAPI)
- Redoc
- Class Validator
- DayJS

---

# 📁 Project Setup

## 1. Install dependencies

```bash
npm install
```

---

## 2. Setup environment variables

Create files:

```
.env.development
.env.staging
.env.production
```

Example `.env.development`:

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

## 3. Create PostgreSQL database

```sql
CREATE DATABASE appointment_dev;
```

---

## 4. Run project

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
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

# 🧠 System Design Notes

- Slots are generated dynamically (no cron job required)
- Database stores only bookings (not slots)
- Composite uniqueness prevents duplicate booking (date + time)
- Config table controls system behavior

---

# ⚠️ Assumptions

- Single service provider system
- No authentication implemented
- Timezone is server-based
- Fixed slot duration unless configured

---

# ✅ Run Summary

```bash
npm install
npm run start:dev
```

Then open:

- Swagger: [http://localhost:3000/swagger](http://localhost:3000/swagger)
- Redoc: [http://localhost:3000/docs](http://localhost:3000/docs)

```

```
