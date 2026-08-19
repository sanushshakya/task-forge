// lib/logger.ts

import { format } from 'util';
import { inspect } from 'util';

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
    console.info(`[INFO] ${formatMessage(message, ...args)}`);
  },

  /**
   * Logs a warning message.
   * @param message - The message to log.
   * @param args - Additional arguments to pass to the message formatting function.
   */
  warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${formatMessage(message, ...args)}`);
  },

  /**
   * Logs an error message.
   * @param message - The message to log.
   * @param args - Additional arguments to pass to the message formatting function.
   */
  error(message: string, ...args: any[]): void {
    console.error(`[ERROR] ${formatMessage(message, ...args)}`);
  },
};

/**
 * Formats a message with a timestamp and the specified level prefix.
 * @param message - The message to format.
 * @param args - Additional arguments to pass to the message formatting function.
 * @returns A formatted string with the current timestamp and level prefix.
 */
function formatMessage(message: string, ...args: any[]): string {
  const timestamp = new Date().toISOString();
  const formattedArgs = args.length > 0 ? ` ${inspect(args)}` : '';
  return `${timestamp} ${message}${formattedArgs}`;
}