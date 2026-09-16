// app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import sendEmail from "@/services/sendEmail";

/**
 * Handles user signup requests.
 * @param request - The incoming request object.
 * @returns A response indicating success or failure.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse('Email already exists', { status: 409 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
      email,
      passwordHash: hashedPassword,
    });

    // Send welcome email
    try {
      await sendEmail(email, "Welcome to DailyLog", `
        <h1>Welcome to DailyLog</h1>
        <p>Hi there! Thank you for signing up. We're excited to have you on board.</p>
      `);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Optionally, log the error and continue with the response
    }

    return new NextResponse('User created successfully', { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}