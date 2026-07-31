import jwt from 'jsonwebtoken';

/**
 * JWT Handler for encoding and decoding JWT tokens with expiration.
 */
export class JWTHandler {
  private secretKey: string;
  private expiresIn: string;

  /**
   * Initializes the JWT Handler with a secret key and token expiration time.
   * @param secretKey - The secret key used to sign and verify JWTs.
   * @param expiresIn - The time until the JWT expires, e.g., '7d' for 7 days.
   */
  constructor(secretKey: string, expiresIn: string) {
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;
  }

  /**
   * Encodes a payload into a JWT token with an expiration time.
   * @param payload - The data to be encoded in the JWT.
   * @returns A promise that resolves to the encoded JWT token.
   */
  public async encode(payload: any): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this.secretKey,
        { expiresIn: this.expiresIn },
        (error, token) => {
          if (error) reject(error);
          else resolve(token);
        }
      );
    });
  }

  /**
   * Decodes a JWT token to extract the payload.
   * @param token - The JWT token to be decoded.
   * @returns A promise that resolves to the decoded payload or an error message.
   */
  public async decode(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.secretKey,
        (error, decoded) => {
          if (error) reject('Invalid token');
          else resolve(decoded);
        }
      );
    });
  }
}

// Usage example:
// const jwtHandler = new JWTHandler(process.env.JWT_SECRET as string, '7d');
// const token = await jwtHandler.encode({ userId: 'user123' });
// const payload = await jwtHandler.decode(token);