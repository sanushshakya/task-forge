// models/Feature.ts

/**
 * Represents a feature in the application.
 */
export interface Feature {
  /**
   * The unique identifier for the feature.
   */
  _id: string;

  /**
   * The name of the feature.
   */
  name: string;

  /**
   * A brief description of the feature.
   */
  description: string;

  /**
   * Indicates whether the feature is enabled or disabled.
   */
  isEnabled: boolean;
}