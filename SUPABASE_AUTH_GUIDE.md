# Supabase Authentication Guide

## Overview

This project uses Supabase for user authentication. The authentication module is located in `src/auth/` and provides endpoints for user signup, login, logout, and profile retrieval.

## Setup

### 1. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Navigate to Project Settings > API
4. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**

### 2. Configure Environment Variables

Add your Supabase credentials to `.env`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## Authentication Endpoints

### Signup

**POST** `/auth/signup`

Register a new user.

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe"
}
```

### Login

**POST** `/auth/login`

Login with existing credentials.

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

### Logout

**POST** `/auth/logout`

Logout the current user session.

### Get Current User

**GET** `/auth/me`

Get the authenticated user's profile.

**Headers:**

```
Authorization: Bearer <access_token>
```

## Usage in Your Code

### Import the Supabase Client

```typescript
import { getSupabaseClient } from './supabaseClient';

const supabase = getSupabaseClient();
```

### Creating a New Service

When creating new services that need Supabase:

```typescript
import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../supabaseClient';

@Injectable()
export class MyService {
  private supabase = getSupabaseClient();

  async myMethod() {
    // Use this.supabase here
    const { data, error } = await this.supabase.from('my_table').select('*');
  }
}
```

## Extending the Auth Module

### Adding New Endpoints

1. Add DTOs in `src/auth/dto/`
2. Add methods to `AuthService`
3. Add controller endpoints to `AuthController`
4. Update Swagger decorators for documentation

Example:

```typescript
// In auth.service.ts
async updateProfile(userId: string, updates: UpdateProfileDto) {
  const { data, error } = await this.supabase.auth.updateUser(updates);

  if (error) {
    throw new BadRequestException(error.message);
  }

  return data;
}

// In auth.controller.ts
@Patch('profile')
@ApiOperation({ summary: 'Update user profile' })
async updateProfile(
  @Headers('authorization') authorization: string,
  @Body() updateDto: UpdateProfileDto
) {
  const token = authorization?.replace('Bearer ', '');
  const user = await this.authService.getCurrentUser(token);
  return this.authService.updateProfile(user.id, updateDto);
}
```

## Security Best Practices

1. **Always validate input**: Use class-validator decorators in DTOs
2. **Use environment variables**: Never hardcode credentials
3. **Implement rate limiting**: Consider using `@nestjs/throttler`
4. **Secure endpoints**: Use guards for protected routes
5. **Handle errors properly**: Don't expose sensitive error details to clients

## Testing

Test authentication endpoints using Swagger UI at `/docs` or with curl/Postman:

```bash
# Test signup
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","fullName":"Test User"}'

# Test login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

## Troubleshooting

### "Missing Supabase credentials" Error

Make sure your `.env` file contains valid `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

### Authentication Failed

1. Check that the email is confirmed in Supabase (check your email or disable email confirmation in Supabase dashboard)
2. Verify password meets minimum requirements (6 characters)
3. Check Supabase logs in the dashboard

### CORS Issues

CORS is already enabled in `main.ts`. If you still have issues, configure specific origins:

```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true,
});
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [NestJS Documentation](https://docs.nestjs.com)
