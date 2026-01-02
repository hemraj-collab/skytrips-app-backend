<<<<<<< HEAD
# skytrips-app-backend
=======
# Sky Trips Backend Application

A professional NestJS backend application for Sky Trips with TypeScript, Yarn package manager, and comprehensive environment configuration.

## Features

- **NestJS Framework**: Built with the latest NestJS framework
- **TypeScript**: Full TypeScript support with proper typing
- **Supabase Authentication**: User signup, login, and session management with Supabase
- **Swagger API Documentation**: Interactive API documentation at `/docs` and `/admin/docs`
- **Authentication**: Basic Auth protection for API documentation
- **Validation**: Global validation pipes with class-validator
- **Compression**: Response compression enabled
- **CORS**: Cross-Origin Resource Sharing enabled
- **Static Files**: Serve static files from the `public` directory
- **Environment Configuration**: Comprehensive `.env` configuration using `@nestjs/config`
- **Professional Structure**: Clean and scalable folder structure with library support
- **Testing**: Unit and E2E tests configured with Jest
- **Linting & Formatting**: ESLint and Prettier configured
- **Production Ready**: Optimized for production deployment

## Prerequisites

- Node.js (v18 or higher recommended)
- Yarn package manager
- Supabase account (for authentication features)

## Installation

```bash
# Install dependencies
yarn install
```

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon/public key
4. Add them to your `.env` file:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

## Environment Configuration

Copy the `.env.example` file to `.env` and configure the environment variables:

```bash
cp .env.example .env
```

### Environment Variables

The application supports the following environment variables:

#### Application Properties

- `APP_HOST`: Application host (default: localhost)
- `APP_PORT`: Application port (default: 8080)
- `APP_ENV`: Application environment (local, development, production)

#### Supabase Configuration

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

#### Logger Properties

- `LOG_LEVEL`: Logging level (debug, info, warn, error)
- `LOG_DESTINATION`: Log destination (console, file)
- `LOG_PRETTYPRINT`: Pretty print logs (true/false)
- `LOG_MDCENABLED`: Enable MDC logging (true/false)

#### GraphQL Properties

- `GRAPHQL_PLAYGROUND`: Enable GraphQL playground
- `GRAPHQL_DEBUG`: Enable GraphQL debug mode

#### MongoDB Properties

- `DB_TYPE`: Database type (mongodb)
- `MONGO_URI`: MongoDB connection URI
- `MONGO_AUTH_DB`: MongoDB authentication database

#### Amadeus API Properties

- `AMADEUS_API_KEY`: Amadeus API key
- `AMADEUS_API_SECRET`: Amadeus API secret
- `AMADEUS_BASE_URL`: Amadeus base URL
- `AMADEUS_OAUTH_URI`: Amadeus OAuth URI
- `AMADEUS_OFFER_SEARCH_URI`: Offer search endpoint
- `AMADEUS_OFFER_PRICE_URI`: Offer price endpoint
- `AMADEUS_OFFER_CREATE_URI`: Offer create endpoint

#### Company Properties

- Company contact and address information

#### JWT Properties

- `ACCESS_TOKEN_SECRET`: Secret for access tokens
- `ACCESS_TOKEN_EXPIRES_IN`: Access token expiration time
- `REFRESH_TOKEN_SECRET`: Secret for refresh tokens
- `REFRESH_TOKEN_EXPIRES_IN`: Refresh token expiration time

#### Mailgun Configuration

- `MAILGUN_USERNAME`: Mailgun username
- `MAILGUN_API_KEY`: Mailgun API key
- `MAILGUN_DOMAIN`: Mailgun domain
- `FE_EMAIL_REDIRECT_URL`: Frontend email redirect URL

#### Bank Configuration

- `COMMON_BANK_PUBLIC_KEY`: Bank public key
- `COMMON_BANK_PRIVATE_KEY`: Bank private key

#### AWS Configuration

- `AWS.S3.BUCKET_NAME`: S3 bucket name
- `AWS.S3.BUCKET_REGION`: S3 bucket region
- `AWS.S3.ACCESS_KEY_ID`: AWS access key ID
- `AWS.S3.SECRET_ACCESS_KEY`: AWS secret access key

## Running the Application

```bash
# Development mode with hot-reload
yarn start:dev

# Production mode
yarn start:prod

# Debug mode
yarn start:debug
```

The application will start on `http://localhost:8080` (or the port specified in your `.env` file).

## API Documentation

The application provides interactive Swagger API documentation:

- **Regular API Documentation**: [http://localhost:8080/docs](http://localhost:8080/docs)
- **Admin API Documentation**: [http://localhost:8080/admin/docs](http://localhost:8080/admin/docs)

Both documentation endpoints are protected with Basic Authentication:

- **Username**: `skytrips`
- **Password**: `Skytrips@123`

> **Note**: For production, change these credentials to environment variables.

## API Endpoints

### Root

#### GET /

Returns "Hello World!" message.

**Response:**

```
Hello World!
```

### Authentication (Supabase)

#### POST /auth/signup

Register a new user with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe" // Optional
}
```

**Response:**

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "email_confirmed_at": "2024-01-01T00:00:00.000Z",
    "user_metadata": {
      "full_name": "John Doe"
    },
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": 1735819200
  }
}
```

> **Note:** The session object contains both `access_token` (JWT) and `refresh_token` for authentication.

#### POST /auth/login

Login existing user with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "email_confirmed_at": "2024-01-01T00:00:00.000Z",
    "user_metadata": {
      "full_name": "John Doe"
    },
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": 1735819200
  }
}
```

> **Important:** Store the `access_token` for authenticated requests and `refresh_token` to renew the access token when it expires.

#### POST /auth/logout

Logout the current user.

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

#### GET /auth/me

Get current authenticated user details.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "id": "...",
  "email": "user@example.com",
  ...
}
```

### Password Reset (OTP-based)

#### POST /auth/forgot-password

Request a password reset OTP to be sent to the user's email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "If the email exists, an OTP has been sent",
  "expiresIn": 600
}
```

> **Note:** OTP is valid for 10 minutes and logged to console in development mode.

#### POST /auth/verify-otp

Verify the OTP code before resetting password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "valid": true,
  "message": "OTP verified successfully"
}
```

#### POST /auth/reset-password

Reset password using verified OTP.

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePassword123!"
}
```

**Response:**

```json
{
  "message": "Password reset successfully"
}
```

#### POST /auth/resend-otp

Resend a new OTP if the previous one expired.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "If the email exists, an OTP has been sent",
  "expiresIn": 600
}
```

## Project Structure

```
skytrips_app_backend/
├── libs/
│   └── swagger/             # Swagger library
│       └── src/
│           ├── swagger.service.ts  # Swagger setup service
│           └── index.ts            # Library exports
├── public/                  # Static files directory
├── src/
│   ├── auth/                # Authentication module
│   │   ├── dto/
│   │   │   └── auth.dto.ts  # Authentication DTOs
│   │   ├── auth.controller.ts    # Auth controller (signup/login)
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.service.ts       # Auth service (Supabase auth)
│   │   └── auth.module.ts        # Auth module
│   ├── supabaseClient.ts    # Supabase client initialization
│   ├── main.ts              # Application entry point with middleware
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # Root controller
│   ├── app.service.ts       # Root service
│   └── app.controller.spec.ts # Controller tests
├── test/
│   ├── app.e2e-spec.ts      # E2E tests
│   └── jest-e2e.json        # E2E Jest configuration
├── .env                      # Environment variables
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── nest-cli.json            # NestJS CLI configuration
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
└── README.md                # This file
```

## Testing

### Authentication Endpoints

You can test the authentication endpoints using the Swagger UI at `/docs` or with curl:

```bash
# Signup
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Get current user
curl -X GET http://localhost:8080/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Unit and E2E Tests

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov

# Watch mode
yarn test:watch
```

## Building for Production

```bash
# Build the project
yarn build

# The compiled output will be in the dist/ directory
```

## Code Quality

```bash
# Lint the code
yarn lint

# Format the code
yarn format
```

## Extending the Application

### Adding a New Module

1. Generate a new module:

```bash
yarn nest generate module <module-name>
```

2. Generate a controller:

```bash
yarn nest generate controller <module-name>
```

3. Generate a service:

```bash
yarn nest generate service <module-name>
```

### Adding Environment Variables

1. Add the variable to `.env` and `.env.example`
2. Access it in your code using `ConfigService`:

```typescript
import { ConfigService } from '@nestjs/config';

constructor(private configService: ConfigService) {}

const myVar = this.configService.get<string>('MY_VARIABLE');
```

## Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Package Manager**: Yarn
- **Testing**: Jest
- **Linting**: ESLint
- **Formatting**: Prettier
- **Config Management**: @nestjs/config

## License

UNLICENSED - Private project

## Support

For support, please contact the development team.
>>>>>>> 01c8d16 (Initial Commit)
