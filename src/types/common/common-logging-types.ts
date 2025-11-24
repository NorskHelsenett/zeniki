/**
 * @fileoverview Common logging type definitions and constants for Winston logger configuration.
 * 
 * Provides shared logging constants and type definitions used across the Zeniki logging system.
 * Includes Winston log level mappings following RFC 5424 severity standards and console color
 * configurations for enhanced development output readability. These constants ensure consistent
 * logging behavior across all application components and transports.
 */

/**
 * Color mappings for console log output to enhance readability in development.
 * Maps log levels to terminal color codes for Winston colorization.
 * 
 * @constant
 * @type {Object<string, string>}
 */
export const WinstonLoggerConsoleColors = {
  error: "red", // Error messages in red
  warning: "yellow", // Warnings in yellow
  info: "green", // Info messages in green
  notice: "magenta", // HTTP access logs in magenta
  debug: "white", // Debug messages in white
  crit: "red", // Critical errors in red
  alert: "bold red", // Alerts in bold red
  emerg: "bold red", // Emergency messages in bold red
};

/**
 * Syslog-compatible log levels following RFC 5424 severity levels.
 * Lower numbers indicate higher severity for priority-based log filtering.
 * 
 * @constant
 * @type {Object<string, number>}
 */
export const WinstonLoggerLevels = {
  emerg: 0, // Emergency: system is unusable
  alert: 1, // Alert: action must be taken immediately
  crit: 2, // Critical: critical conditions
  error: 3, // Error: error conditions
  warning: 4, // Warning: warning conditions
  notice: 5, // Notice: normal but significant condition (used for HTTP access logs)
  info: 6, // Informational: informational messages
  debug: 7, // Debug: debug-level messages
};
