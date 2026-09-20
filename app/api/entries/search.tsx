import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/db/connect';
import { Entry } from '@/models/Entry';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { query } = req;

  // Connect to MongoDB database
  await connectToDatabase();

  if (method === 'GET') {
    try {
      const searchQuery = query.q as string;

      // Search entries by notes using a regex pattern for case-insensitive matching
      const entries = await Entry.find({
        notes: { $regex: searchQuery, $options: 'i' },
      });

      res.status(200).json(entries);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
```

### Explanation:

1. **Imports**:
   - `NextApiRequest` and `NextApiResponse` from `next` to handle API requests and responses.
   - `connectToDatabase` from `@/db/connect` to establish a connection to the MongoDB database.
   - `Entry` from `@/models/Entry` to access the Entry model.

2. **Handler Function**:
   - The function `handler` is exported as the default export of the module.
   - It takes two parameters: `req` (the request object) and `res` (the response object).

3. **Method Handling**:
   - The method of the incoming request (`method`) is checked to determine how to handle it.
   - If the method is `GET`, the function proceeds to search for entries.

4. **Search Query**:
   - The search query is extracted from the query parameters (`query.q`).
   - A regex pattern is used with the `$options: 'i'` flag to perform a case-insensitive search on the `notes` field of the `Entry` model.

5. **Database Connection**:
   - The database connection is established using `connectToDatabase()` before attempting any database operations.

6. **Error Handling**:
   - If an error occurs during the database query, a 500 status code with an error message is returned.
   - For unsupported methods (anything other than GET), a 405 status code with an appropriate message is returned.

### Notes:
- Ensure that the `connectToDatabase` function and the `Entry` model are correctly set up in your project.
- This route assumes that you have implemented proper authentication middleware to restrict access to authenticated users.
- The response returns an array of entries that match the search criteria.