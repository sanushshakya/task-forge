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

### JWT Handling in `lib/auth.ts`
This project utilizes JSON Web Tokens (JWT) for user authentication. The JWT is generated upon successful login and set as an httpOnly cookie. It contains a payload with the user's ID and has a 7-day expiration time.

#### Example JWT Payload
```json
{
  "userId": "user-id",
  "iat": current timestamp,
  "exp": current timestamp + 7 days
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

---

## New Component: EntryForm

The `EntryForm` component allows users to add tasks, toggle their status, remove tasks, rate their mood on a 1-5 scale, and add notes. Upon submission, it posts the data to `/api/entries` using the `fetch` API.

### Usage

```jsx
import React from 'react';
import EntryForm from '@/components/EntryForm';

const App = () => {
  return (
    <div>
      <h1>Task Manager</h1>
      <EntryForm />
    </div>
  );
};

export default App;
```

### Component Details

#### State Management
- `tasks`: Array of tasks with properties `id`, `text`, and `completed`.
- `mood`: Number representing the user's mood (1-5).
- `notes`: String containing any additional notes.

#### Functions
- `addTask(text: string)`: Adds a new task to the state.
- `removeTask(id: number)`: Removes a task from the state by its ID.
- `toggleTask(id: number)`: Toggles the completion status of a task.
- `handleMoodChange(event: React.ChangeEvent<HTMLInputElement>)`: Updates the mood based on the slider input.
- `handleNotesChange(event: React.ChangeEvent<HTMLTextAreaElement>)`: Updates the notes based on the textarea input.
- `handleSubmit(event: React.FormEvent<HTMLFormElement>)`: Handles form submission, constructs the payload, and sends it to `/api/entries`.

### Styling
The component uses inline styles for simplicity. Consider using styled components or CSS modules in a production environment.

### Error Handling
No error handling is included in this example. In a real-world application, you should add appropriate error messages and handle network errors gracefully.

---

End of README updates.