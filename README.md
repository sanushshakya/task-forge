import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { validateEntry } from '@/lib/validation';

/**
 * Handles user signup requests.
 * @param request - The incoming request object.
 * @returns A response indicating success or failure.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, mood, notes } = await request.json();

    // Validate the entry data using the Zod schema
    const validationError = validateEntry({
      mood,
      notes,
    });

    if (validationError) {
      return new NextResponse(JSON.stringify(validationError.issues), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new NextResponse(JSON.stringify({ message: 'Email already in use' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      mood,
      notes,
    });

    await newUser.save();

    return NextResponse.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

```markdown
## New Feature

- **POST `/api/entries`**

#### Description
This endpoint allows users to create new entries. It first validates the request body using a Zod schema defined in `lib/validation.ts`. If the data is invalid, it returns a 400 error with the validation errors. Otherwise, it proceeds to create the entry.

#### Request Body
```json
{
  "mood": 3,
  "notes": "I had a good day today."
}
```

#### Response on Success
```json
{
  "message": "User created successfully"
}
```

#### Response on Validation Error
```json
{
  "issues": [
    {
      "path": ["mood"],
      "code": "invalid_type",
      "expected": "number",
      "received": "string",
      "message": "Expected number, received string"
    }
  ]
}
```

#### Response on Conflict (Email already exists)
```json
{
  "message": "Email already in use"
}
```