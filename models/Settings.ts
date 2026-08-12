// models/Settings.ts

/**
 * Represents a user's settings including preferences for AI summaries and weekly insights.
 */
export interface Settings {
  /**
   * Indicates whether AI summary generation is enabled.
   */
  aiSummaryEnabled: boolean;

  /**
   * Indicates whether weekly insight generation is enabled.
   */
  weeklyInsightEnabled: boolean;
}