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

  // Existing code for handling the POST request
  try {
    // Process the request
    const data = await processRequestData(req);
    return res.status(200).json(data);
  } catch (error) {
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
 * Processes the data received in the POST request.
 * @param req - The HTTP request object.
 * @returns A Promise that resolves with the processed data.
 */
async function processRequestData(req: Request): Promise<any> {
  // Extract data from the request body
  const { data } = await req.json();

  // Process the data (example operation)
  const result = data.map(item => item.toUpperCase());

  return result;
}