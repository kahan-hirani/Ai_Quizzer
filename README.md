<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=240&color=0:0F172A,50:0369A1,100:14B8A6&text=AI%20Quizzer&fontColor=ffffff&fontAlignY=40&desc=Adaptive%20Learning%20API%20with%20AI%2C%20Caching%2C%20Analytics&descAlignY=62&animation=twinkling" alt="AI Quizzer Banner" />
</p>

<p align="center">
  <a href="https://ai-quizzer-kahanhirani.vercel.app"><img src="https://img.shields.io/badge/Live-Vercel-111827?style=for-the-badge&logo=vercel&logoColor=white" alt="Live"></a>
  <a href="https://ai-quizzer-kahanhirani.vercel.app/api-docs"><img src="https://img.shields.io/badge/API-Docs-0EA5E9?style=for-the-badge&logo=swagger&logoColor=white" alt="Swagger"></a>
  <img src="https://img.shields.io/badge/Node.js-20%2B-16A34A?style=for-the-badge&logo=node.js&logoColor=white" alt="Node">
  <img src="https://img.shields.io/badge/Express-5-111827?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-8.18-14532D?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Redis-Upstash-C2410C?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
</p>

# AI Quizzer

AI Quizzer is a production-ready backend API for adaptive quiz learning.
It combines LLM-generated questions and hints, secure authentication, submission analytics, Redis caching, and email delivery into one clean Express service.

## Why This Project Stands Out

- Adaptive quiz generation based on learner performance history
- AI-powered hint generation without revealing answers
- Submission intelligence with score tracking and improvement tips
- Leaderboard analytics with fast Redis caching
- Swagger-first API documentation for rapid testing and integration
- Serverless-ready deployment on Vercel

## Live Links

- Application: https://ai-quizzer-kahanhirani.vercel.app
- API Base: https://ai-quizzer-kahanhirani.vercel.app/api/v1
- Swagger UI: https://ai-quizzer-kahanhirani.vercel.app/api-docs
- Swagger JSON: https://ai-quizzer-kahanhirani.vercel.app/api-docs.json

## Tech Stack

| Layer | Technologies |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Cache | Redis via ioredis (Upstash-compatible TLS) |
| Auth | JWT + bcrypt |
| AI | Groq Chat Completions API |
| Validation | Joi |
| Docs | swagger-jsdoc + swagger-ui-express |
| Email | Nodemailer |
| Logging | Morgan |
| Deployment | Vercel |

## Architecture Overview

```mermaid
flowchart TD
    C[Client Apps] --> R[Express Router Layer]
    R --> M[Validation and Auth Middlewares]
    M --> CTRL[Controllers]
    CTRL --> DB[(MongoDB)]
    CTRL --> REDIS[(Redis Cache)]
    CTRL --> GROQ[Groq LLM API]
    CTRL --> MAIL[SMTP via Nodemailer]
    R --> SWG[Swagger UI and OpenAPI JSON]
```

## Request Lifecycle

1. Client sends a request to /api/v1 endpoint.
2. Route-level Joi schema validates body or query.
3. JWT middleware authenticates protected routes.
4. Controller executes business logic.
5. Controller reads or writes data in MongoDB.
6. Cache-aware controllers check Redis before heavy operations.
7. AI-enabled controllers call Groq for question generation, hints, or tips.
8. Unified error middleware formats errors into JSON responses.

## Feature Deep Dive

### 1) Authentication

- Register and login endpoints return JWT tokens.
- Protected routes require Authorization: Bearer token.
- Profile endpoint resolves authenticated user from token payload.

### 2) Adaptive Quiz Generation

- The service inspects prior submissions for the user.
- It computes average score and derives question difficulty:
  - Average above 80: hard
  - Average above 50: medium
  - Otherwise: easy
- Groq generates a strict JSON question set.
- Questions are persisted to MongoDB and cached in Redis for quick reads.

### 3) Hint Engine

- User sends quizId and questionId.
- API validates ownership and question presence.
- Groq returns a student-friendly hint without revealing the answer key.

### 4) Submission and Feedback Intelligence

- Answers are evaluated against quiz answer keys.
- Mistakes are captured with expected vs received options.
- Attempt count is tracked per user and quiz.
- Groq generates compact improvement suggestions.
- Score summary can be emailed to the learner.

### 5) Leaderboard Analytics

- Aggregates submission data by user.
- Computes average score, max score, and total attempts.
- Supports filtering by subject, grade, and limit.
- Caches leaderboard slices in Redis to reduce DB load.

## API Surface

All endpoints are under /api/v1.

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /users/register | Register user | No |
| POST | /users/login | Login user | No |
| POST | /users/logout | Logout user | Yes |
| GET | /users/profile | Current user profile | Yes |

### Quiz

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /quiz | Create adaptive quiz | Yes |
| GET | /quiz | List logged-in user quizzes | Yes |
| GET | /quiz/:quizId | Get one quiz by id | Yes |
| DELETE | /quiz/:quizId | Delete one quiz | Yes |
| POST | /quiz/:quizId/hint | Generate hint for question | Yes |

### Submission

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /submission/:quizId/submit | Submit quiz answers | Yes |
| POST | /submission/:quizId/retry | Retry same quiz | Yes |
| GET | /submission/history | Filtered attempt history | Yes |

### Leaderboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /leaderboard | Rank students by performance | Yes |

## Data Model Summary

### User

- username
- email
- password (hashed)

### Quiz

- subject
- grade
- questions array
- createdBy
- adaptiveDifficultyUsed

### Submission

- userId
- quizId
- answers array
- score
- mistakes
- suggestions
- attemptNo
- subject and grade snapshots

## Environment Variables

Create a .env file in project root:

```properties
PORT=5000
DB_URL=mongodb://localhost:27017/aiQuizzer
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
REDIS_URL=redis://default:your_upstash_password@your-upstash-host.upstash.io:6379
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Notes:

- REDIS_URL can be plain redis URL.
- If you accidentally paste the full redis-cli --tls -u command into REDIS_URL, this project now extracts the URL safely.

## Local Development

```bash
npm install
npm run dev
```

Local endpoints:

- API: http://localhost:5000/api/v1
- Swagger UI: http://localhost:5000/api-docs
- Swagger JSON: http://localhost:5000/api-docs.json

## Deployment Notes

- Vercel entrypoint uses api/index.js.
- Swagger docs are exposed with static UI + JSON spec path.
- For production, ensure all required environment variables are set in Vercel.

## Suggested Testing Flow

1. Register a user.
2. Login and copy token.
3. Create quiz with subject, grade, numQuestions.
4. Fetch quiz and submit answers.
5. Retry with improved answers.
6. Open leaderboard with subject and grade filters.
7. Request hint for a weak question.

## Project Structure

```text
api/               # Serverless adapter for Vercel
controllers/       # Business logic and AI integration
db/                # Mongo and Redis connection setup
middlewares/       # Auth, validation, centralized error handling
models/            # Mongoose schemas
routes/            # API route definitions + Swagger annotations
utilities/         # Async wrapper, mailer, custom error helper
validations/       # Joi request schemas
server.js          # Express bootstrap
swagger.js         # OpenAPI and Swagger UI setup
```

## Built For

- Students who need adaptive practice
- Educators who want fast assessment APIs
- Developers exploring AI-enhanced backend architecture

---

If you like the project, star the repository and share feedback to help shape the next release.
