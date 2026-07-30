/**
 * @file src/routes/index.js
 * @description Route definitions for the Next.js 14 App Router project with MongoDB caching using mongoose.
 */

const { NextResponse } = require('next/server');
const { getUserById } = require('../lib/models');
const { getMongoConnection } = require('../lib/mongodb');

/**
 * GET /api/user/:id - Retrieve a user by ID
 */
export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    // Get the cached MongoDB connection using mongoose
    const connection = await getMongoConnection();
    
    // Fetch user from the database
    const user = await getUserById(connection, id);
    
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