import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import Team from '@/models/Team';
import { get_current_user } from '@/auth/dependencies.py';

/**
 * Handles user login requests.
 * @param request - The incoming request object.
 * @returns A response indicating success or failure.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    // Verify the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set the token as an HttpOnly cookie
    return NextResponse.json({ message: 'Login successful' }, {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; Path=/; HttpOnly; Secure`
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Middleware to ensure the routes only process requests for authenticated users
 */
export async function protectedRoute(request: NextRequest, handler: (request: NextRequest) => Promise<NextResponse>) {
  const user = await get_current_user(request);
  
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return handler(request);
}