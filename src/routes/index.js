/**
 * @file src/routes/index.js
 * @description Route definitions for the Next.js 14 App Router project.
 */

const { NextResponse } = require('next/server');
const { getUserById } = require('../lib/models');

/**
 * GET /api/user/:id - Retrieve a user by ID
 */
export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    const user = await getUserById(id);
    
    if (user) {
      return NextResponse.json(user, { status: 200 });
    } else {
      return new NextResponse('User not found', { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}