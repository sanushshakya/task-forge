// README.md

## Project Overview

This project is a Next.js 14 App Router application designed to serve as a template for building modern web applications. It includes essential folders and files to help you get started quickly.

### Folders
- `app/api`: Contains API routes.
- `lib`: Includes utility functions and libraries.
- `models`: Stores data models for the application.
- `components`: Houses reusable React components.

## Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/task.git
   cd task
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add any necessary environment variables.

4. **Run the Application**:
   ```bash
   npm run dev
   ```

## API Documentation

### Base URL
All API routes are accessible via the base URL: `http://localhost:3000/api`.

### Authentication Endpoints

#### Endpoint
- **POST `/api/auth/login`**

#### Description
This endpoint handles user login requests. It verifies the email and password against the User model using bcrypt.compare, issues a JWT using jsonwebtoken with 7-day expiry, and sets it as an httpOnly cookie.

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response on Success
```json
{
  "message": "Login successful"
}
```

#### Response on Failure
```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

### Example Route

#### Endpoint
- **GET `/api/example`**

#### Description
This endpoint returns a simple JSON response.

#### Response
```json
{
  "message": "Hello, World!"
}
```

### Error Handling

All API endpoints return consistent error responses in the following format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

## Contributing

Contributions are welcome! Please open an issue to discuss any new features, bug fixes, or improvements.

## License

This project is licensed under the ISC license. See the [LICENSE](LICENSE) file for details.