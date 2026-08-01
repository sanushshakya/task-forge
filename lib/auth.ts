import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Dependency for decoding a JWT token and returning the current user.
 */
export class JWTDependency {
    private secretKey: string;

    /**
     * Initializes the JWTDependency with a secret key.
     * @param secretKey - The secret key used to decode the JWT token.
     */
    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    /**
     * Decodes a JWT token and returns the decoded payload or null if invalid.
     * @param token - The JWT token to decode.
     * @returns The decoded payload or null if invalid.
     */
    async decodeToken(token: string | undefined): Promise<string | null> {
        try {
            if (!token) return null;
            const decoded = await jwt.verify(token, this.secretKey);
            return decoded.userId as string;
        } catch (error) {
            return null;
        }
    }
}

/**
 * Extracts the JWT token from a request's cookies and returns the userId or null.
 * @param req - The incoming request object.
 * @returns The userId if authenticated, otherwise null.
 */
export function getUserFromRequest(req: NextRequest): string | null {
    const jwtDependency = new JWTDependency(process.env.JWT_SECRET as string);
    const token = req.cookies.get('jwt')?.value;
    return jwtDependency.decodeToken(token);
}