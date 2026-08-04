// app/api/summary/types.ts

/**
 * Interface representing the request body for generating an entry summary.
 */
export interface SummaryRequest {
  entryId: string;
}

/**
 * Interface representing the response body for a generated entry summary.
 */
export interface SummaryResponse {
  summary: string;
}