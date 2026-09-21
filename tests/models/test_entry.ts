// models/Entry.ts

import { Schema, Document } from 'mongoose';

/**
 * Represents an entry in the application associated with a user and team.
 */
export interface Entry extends Document {
  /**
   * The unique identifier for the entry.
   */
  _id: string;

  /**
   * Reference to the user who created the entry.
   */
  userId: string;

  /**
   * Optional reference to the team associated with the entry.
   */
  teamId?: string;

  /**
   * The notes or content of the entry.
   */
  notes: string;

  /**
   * An array of tags associated with the entry, defaulting to an empty array if not provided.
   */
  tags: string[];
}

const entrySchema = new Schema<Entry>({
  userId: { type: String, required: true },
  teamId: { type: String },
  notes: { type: String, required: true },
  tags: { type: [String], default: [] }
});

export const Entry = mongoose.model<Entry>('Entry', entrySchema);
```

**Migration Note:** Existing documents in the `entries` collection will have an empty array for the `tags` field by default. No action is needed for existing entries.

```typescript
// tests/models/test_entry.ts

import { expect } from 'chai';
import { Entry } from '../../models/Entry';

describe('Entry Model', () => {
  it('should create a new entry with an empty tags array', async () => {
    const entry = await Entry.create({
      userId: 'user123',
      notes: 'Test entry'
    });

    expect(entry.tags).to.deep.equal([]);
  });

  it('should update the tags field of an existing entry', async () => {
    const entry = new Entry({
      userId: 'user456',
      notes: 'Existing entry'
    });
    await entry.save();

    entry.tags = ['test', 'update'];
    await entry.save();

    const updatedEntry = await Entry.findById(entry._id);
    expect(updatedEntry?.tags).to.deep.equal(['test', 'update']);
  });

  it('should return the default empty tags array when accessing a non-existent field', async () => {
    const entry = new Entry({
      userId: 'user789',
      notes: 'No tags'
    });
    await entry.save();

    const foundEntry = await Entry.findById(entry._id);
    expect(foundEntry?.tags).to.deep.equal([]);
  });
});