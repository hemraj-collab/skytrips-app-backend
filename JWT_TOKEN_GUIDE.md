# JWT Token Response Example

## Overview

When a user logs in or signs up, the endpoint returns a complete authentication response including **Supabase-generated JWT access and refresh tokens**.

## Response Structure

### Successful Login/Signup Response

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "email_confirmed_at": "2024-01-01T00:00:00.000Z",
    "user_metadata": {
      "full_name": "John Doe"
    },
    "created_at": "2024-01-01T00:00:00.000Z",
    "app_metadata": {},
    "aud": "authenticated",
    "role": "authenticated"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM1ODE5MjAwLCJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6e30sInVzZXJfbWV0YWRhdGEiOnsiZnVsbF9uYW1lIjoiSm9obiBEb2UifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.signature",
    "refresh_token": "v1.bWVwMjhpTWprb2FOTmE2LXRrb0FRYUE0TXZ0SmhGRmNJdGZOUHlQY3JwOA",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": 1735819200
  }
}
```

## Token Details

### Access Token (JWT)

- **Purpose**: Used for authenticated API requests
- **Usage**: Send in the `Authorization` header as `Bearer <access_token>`
- **Expiration**: Default 1 hour (3600 seconds)
- **Contains**: User claims (id, email, role, metadata, etc.)

### Refresh Token

- **Purpose**: Used to obtain a new access token when it expires
- **Storage**: Store securely (e.g., httpOnly cookie or secure storage)
- **Expiration**: Longer-lived than access token (configurable in Supabase)

### Token Type

- Always `"bearer"`
- Indicates the authentication scheme

### Expires In

- Number of seconds until the access token expires
- Default: 3600 (1 hour)

### Expires At

- Unix timestamp indicating when the access token expires

## Using the Tokens

### 1. Store the Tokens Securely

**Frontend (Browser):**

```javascript
// After login/signup
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

const { user, session } = await response.json();

// Store tokens securely
localStorage.setItem('access_token', session.access_token);
localStorage.setItem('refresh_token', session.refresh_token);
localStorage.setItem('user', JSON.stringify(user));
```

### 2. Use Access Token for Authenticated Requests

```javascript
// Make authenticated request
const response = await fetch('/auth/me', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

const currentUser = await response.json();
```

### 3. Handle Token Expiration

```javascript
// Check if token is expired
const expiresAt = session.expires_at * 1000; // Convert to milliseconds
const isExpired = Date.now() > expiresAt;

if (isExpired) {
  // Refresh the token using Supabase client
  // Or redirect to login
}
```

## Testing with cURL

### Login and Get Tokens

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

### Use Access Token

```bash
# Copy the access_token from the login response
curl -X GET http://localhost:8080/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Testing with Postman

1. **Login/Signup:**
   - Method: POST
   - URL: `http://localhost:8080/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "user@example.com",
       "password": "SecurePassword123!"
     }
     ```
   - Copy `session.access_token` from response

2. **Use Token:**
   - Method: GET
   - URL: `http://localhost:8080/auth/me`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer <paste_access_token_here>`

## Token Security Best Practices

1. **Never expose tokens in URLs** - Always use headers
2. **Store securely** - Use httpOnly cookies or secure storage
3. **Use HTTPS in production** - Prevent token interception
4. **Implement token refresh** - Automatically renew before expiration
5. **Clear tokens on logout** - Remove from storage
6. **Validate token on server** - Never trust client-side validation alone

## Decoding the JWT

You can decode the access token to see its contents (but never store sensitive data in it):

**Using jwt.io:**

1. Go to https://jwt.io
2. Paste your access_token
3. See the decoded payload

**Example Payload:**

```json
{
  "aud": "authenticated",
  "exp": 1735819200,
  "sub": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "phone": "",
  "app_metadata": {},
  "user_metadata": {
    "full_name": "John Doe"
  },
  "role": "authenticated",
  "aal": "aal1",
  "amr": [
    {
      "method": "password",
      "timestamp": 1735815600
    }
  ],
  "session_id": "abc123..."
}
```

## Implementing Token Refresh

To implement token refresh, you can add an endpoint:

```typescript
// In user.service.ts
async refreshToken(refreshToken: string) {
  const { data, error } = await this.supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error) {
    throw new UnauthorizedException('Invalid refresh token');
  }

  return {
    user: data.user,
    session: data.session,
  };
}

// In user.controller.ts
@Post('refresh')
@ApiOperation({ summary: 'Refresh access token' })
async refreshToken(@Body('refresh_token') refreshToken: string) {
  return this.userService.refreshToken(refreshToken);
}
```

## Summary

✅ **Access Token**: JWT for authenticated requests (1 hour expiry)  
✅ **Refresh Token**: Long-lived token for renewing access (configurable)  
✅ **Both tokens** are returned in the `session` object on login/signup  
✅ Use `access_token` in `Authorization: Bearer <token>` header  
✅ Store tokens securely and implement refresh logic

For more details, see the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth).
