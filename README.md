# Session Management System APIs

Basic Node.js backend in TypeScript with:
- Express.js
- MongoDB (mongoose)
- JWT auth middleware
- Health endpoints

## Project structure

- `src/config`: environment config
- `src/db`: MongoDB connection
- `src/middleware`: JWT auth middleware
- `src/controllers`: response handlers
- `src/routes`: express routes
- `src/app.ts`: express app bootstrapping
- `src/server.ts`: entrypoint

## Setup

1. Copy and edit `.env.example` to `.env`
2. Install dependencies:

```bash
npm install
```

3. Run in dev:

```bash
npm run dev
```

4. Build and run production:

```bash
npm run build
npm start
```

## API endpoints

- `GET /api/health` - public health status
- `GET /api/health/protected` - JWT-protected health status

### Test protected endpoint

Use a token signed with your `JWT_SECRET`, for example:

```ts
import { JwtService } from './src/services/jwt.service';
const token = JwtService.sign({ sub: 'system' });
```

Then call with header `Authorization: Bearer <token>`.
