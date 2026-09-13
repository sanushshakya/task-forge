/**
 * Module containing types for the paginated user response.
 */

// Import statements (none needed as this is a TypeScript module)

/**
 * Represents a single user in the paginated user list.
 */
export interface UserResponse {
  /**
   * The unique identifier for the user.
   */
  _id: string;

  /**
   * The username of the user.
   */
  username: string;

  /**
   * The email address of the user.
   */
  email: string;

  /**
   * Indicates whether the user's account is active.
   */
  isActive: boolean;

  /**
   * Optional reference to a team associated with the user.
   */
  teamId?: string;

  /**
   * Indicates whether the user has admin privileges.
   */
  isAdmin: boolean;
}

/**
 * Represents the paginated response containing users.
 */
export interface PaginatedUsersResponse {
  /**
   * The current page number.
   */
  currentPage: number;

  /**
   * The total number of pages available.
   */
  totalPages: number;

  /**
   * The total number of users.
   */
  totalUsers: number;

  /**
   * Array of users on the current page.
   */
  users: UserResponse[];
}