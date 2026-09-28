// handlers/feature.go

/**
 * Handles the POST request for a specific feature.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
async function handleFeature(req: Request, res: Response) {
  // Call verifyOrigin at the top of the handler to check origin
  if (!verifyOrigin(req)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    // Validate request data
    const requestData = await validateRequestData(req);
    
    // Process the request
    const data = await processRequestData(requestData);
    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: 'Bad Request', details: error.details });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Verifies if the origin of the request is allowed.
 * @param req - The HTTP request object.
 * @returns true if the origin is allowed, false otherwise.
 */
function verifyOrigin(req: Request): boolean {
  // List of allowed origins
  const allowedOrigins = ['https://example.com', 'https://api.example.com'];

  // Get the origin from the request headers
  const origin = req.headers.origin;

  // Check if the origin is in the list of allowed origins
  return allowedOrigins.includes(origin || '');
}

/**
 * Validates the data received in the POST request.
 * @param req - The HTTP request object.
 * @returns A Promise that resolves with the validated data.
 */
async function validateRequestData(req: Request): Promise<any> {
  const { data } = await req.json();

  if (!data) {
    throw new ValidationError('Missing request data');
  }

  if (!Array.isArray(data)) {
    throw new ValidationError('Invalid request data format');
  }

  return data;
}

/**
 * Processes the data received in the POST request.
 * @param data - The validated request data.
 * @returns A Promise that resolves with the processed data.
 */
async function processRequestData(data: any[]): Promise<any> {
  // Process the data (example operation)
  const result = data.map(item => item.toUpperCase());

  return result;
}

// Custom error class for validation errors
class ValidationError extends Error {
  details: string;

  constructor(message: string, details?: string) {
    super(message);
    this.details = details || '';
  }
}