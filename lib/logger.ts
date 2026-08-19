// lib/logger.ts

import { format } from 'util';

/**
 * A simple logger with methods for info, warn, and error that prefix output with timestamp and level.
 */
export const logger = {
  /**
   * Logs an informational message.
   * @param message - The message to log.
   * @param args - Additional arguments to pass to the message formatting function.
   */
  info(message: string, ...args: any[]): void {
    console.info(`[INFO] ${format(message, ...args)}`);
  },

  /**
   * Logs a warning message.
   * @param message - The message to log.
   * @param args - Additional arguments to pass to the message formatting function.
   */
  warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${format(message, ...args)}`);
  },

  /**
   * Logs an error message.
   * @param message - The message to log.
   * @param args - Additional arguments to pass to the message formatting function.
   */
  error(message: string, ...args: any[]): void {
    console.error(`[ERROR] ${format(message, ...args)}`);
  },
};